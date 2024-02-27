var WebSocketServer = require("ws").Server;
const WebSocket = require("ws");
var mic = require("microphone-stream");
var wss = new WebSocketServer({ port: 3010 });
const crypto = require("crypto"); // tot sign our pre-signed URL
const v4 = require("./lib/aws-signature-v4"); // to generate our pre-signed URL
var marshaller = require("@aws-sdk/eventstream-marshaller"); // for converting binary event stream messages to and from JSON
let socketError = false;
let transcribeException = false;

var util_utf8_node = require("@aws-sdk/util-utf8-node"); // utilities for encoding and decoding UTF8

var eventStreamMarshaller = new marshaller.EventStreamMarshaller(
  util_utf8_node.toUtf8,
  util_utf8_node.fromUtf8
); // our global variables for managing state

function pcmEncode(input) {
  var offset = 0;
  var buffer = new ArrayBuffer(input.length * 2);
  var view = new DataView(buffer);
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function downsampleBuffer(
  buffer,
  inputSampleRate = 44100,
  outputSampleRate = 16000
) {
  if (outputSampleRate === inputSampleRate) {
    return buffer;
  }

  let sampleRateRatio = inputSampleRate / outputSampleRate;
  let newLength = Math.round(buffer.length / sampleRateRatio);
  let result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < result.length) {
    let nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);

    let accum = 0,
      count = 0;

    for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }

    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }

  return result;
}

const connections = new Map();

const roomConnections = new Map();
wss.on("connection", (socket, req) => {
  const urlParams = new URLSearchParams(req.url.split("?")[1]);
  const participantName = urlParams.get("participantName");
  const roomId = urlParams.get("roomId");
  console.log("Room - Participant", roomId, participantName);
  if (roomId && participantName) {
    if (!roomConnections.has(roomId)) {
      roomConnections.set(roomId, new Set());
    }
    roomConnections.get(roomId).add(socket);
  }

  const roomSocketSet = roomConnections.get(roomId);
  let url = createPresignedUrl();
  console.debug("Presigned url:", url);

  let socketAWS = new WebSocket(url);
  socketAWS.binaryType = "arraybuffer";

  socketAWS.onopen = function () {
    socket.on("message", (rawAudioChunk) => {
      if (rawAudioChunk.byteLength % 4 === 0) {
        try {
          let binary = convertAudioToBinaryMessage(rawAudioChunk);

          // if (rawAudioChunk === 'close') {
          //     console.log('Client ordered to close the server !')
          //     let emptyMessage = getAudioEventMessage(Buffer.from(Buffer.from([])));
          //     let emptyBuffer = eventStreamMarshaller.marshall(emptyMessage);
          //     socketAWS.send(emptyBuffer);
          // }

          if (
            socketAWS.readyState === socketAWS.OPEN &&
            rawAudioChunk !== "close"
          ) {
            socketAWS.send(binary);
          }
        } catch (error) {
          console.log(error);
          console.log(
            "🚀 ~ file: server.js:85 ~ socket.on ~ rawAudioChunk:",
            rawAudioChunk
          );
        }
      }
    });
    // wireSocketEvents();

    participantName === "Your logo"
      ? setupWebSocketListener("Host", roomSocketSet)
      : setupWebSocketListener(participantName, roomSocketSet);
  };

  function setupWebSocketListener(participantName, roomSocketSet) {
    console.log("participantName: ----------------\n", participantName);

    socketAWS.onmessage = function (message) {
      let messageWrapper = eventStreamMarshaller.unmarshall(
        Buffer.from(message.data)
      );
      console.log(
        "messageWrapper.headers-------------------\n",
        messageWrapper.headers
      );
      console.log(
        "messageWrapper.body-------------------\n",
        messageWrapper.body
      );
      let messageBody = JSON.parse(String.fromCharCode(...messageWrapper.body));

      if (messageWrapper.headers[":message-type"].value === "event") {
        handleEventStreamMessage(messageBody, participantName, roomSocketSet);
      } else {
        transcribeException = true;
        console.error(
          "Invalid Format AWS Transcribe Exception",
          messageWrapper.headers
        );
      }
    };

    socketAWS.onerror = function () {
      socketError = true;
      console.error("WebSocket connection error. Try again.");
    };

    socketAWS.onclose = function (closeEvent) {
      if (!socketError && !transcribeException) {
        if (closeEvent.code != 1000) {
          console.log(
            "</i><strong>Streaming Exception</strong><br>" + closeEvent.reason
          );
        }
      }
    };
  }

  function convertAudioToBinaryMessage(audioChunk, inputSampleRate) {
    var raw = mic.toRaw(audioChunk);
    if (raw == null) return;
    inputSampleRate = 48000;

    var downsampledBuffer = downsampleBuffer(raw, inputSampleRate, 44100);
    var pcmEncodedBuffer = pcmEncode(downsampledBuffer);

    var audioEventMessage = getAudioEventMessage(Buffer.from(pcmEncodedBuffer));

    var binary = eventStreamMarshaller.marshall(audioEventMessage);

    return binary;
  }

  // wrap the audio data in a JSON envelope
  function getAudioEventMessage(buffer) {
    return {
      headers: {
        ":message-type": {
          type: "string",
          value: "event",
        },
        ":event-type": {
          type: "string",
          value: "AudioEvent",
        },
      },
      body: buffer,
    };
  }

  function createPresignedUrl() {
    const region = "us-east-2";
    const languageCode = "en-US";
    let endpoint = "transcribestreaming." + region + ".amazonaws.com:8443";

    return v4.createPresignedURL(
      "GET",
      endpoint,
      "/stream-transcription-websocket",
      "transcribe",
      crypto.createHash("sha256").update("", "utf8").digest("hex"),
      {
        key: "AKIAT27I5GU7PWQMRKDV",
        secret: "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",
        sessionToken: "",
        protocol: "wss",
        expires: 15,
        region: region,
        query:
          "language-code=" +
          languageCode +
          "&media-encoding=pcm&sample-rate=" +
          44100,
      }
    );
  }

  const handleEventStreamMessage = function handleEventStreamMessage(
    messageJson,
    participantName,
    roomSocketSet
  ) {
    let results = messageJson.Transcript.Results;
    if (results.length > 0) {
      if (results[0].Alternatives.length > 0) {
        console.debug("Results", results[0].Alternatives[0].Transcript);
        // socket.send(`${participantName}@${results[0].Alternatives[0].Transcript}`);
        roomSocketSet?.forEach((socketInRoom) => {
          socketInRoom.send(
            `${participantName}@${results[0].Alternatives[0].Transcript}`
          );
        });
      }
    }
  };
});

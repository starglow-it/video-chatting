
export interface IHandleAiTranscription {
  script: {
    body: string;
    id: string;
    sender: {
      id: string;
      username: string;
      profileAvatar: string;
    };
  }[];
}

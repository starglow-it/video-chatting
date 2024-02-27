import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import http from 'http';

@Injectable()
export class MeetingRecordCommonService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Create a custom HTTP agent with DNS settings
    const agent = new http.Agent({
      family: 4, // Use IPv4
    });

    // Create an Axios instance with the custom HTTP agent
    this.axiosInstance = axios.create({
      httpAgent: agent,
    });
  }

  async stopRecording({ roomUrl }: { roomUrl: string }): Promise<any> {
    try {
      const result = await this.axiosInstance.post('http://media-server-service:9091/stop-recording', { roomUrl });
      return result;
    } catch (error) {
      // Handle errors here
      console.error('Error:', error);
      throw error; // Re-throw the error to propagate it up the call stack
    }
  }
}

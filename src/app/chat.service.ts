// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  async getAIResponse(prompt: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_OPENAI_API_KEY`
    };

    const body = {
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}],
      temperature: 0.7
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
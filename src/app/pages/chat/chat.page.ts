import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Thêm dòng này

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule], // Thêm CommonModule
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatbotPage {
  userInput = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [];

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userText = this.userInput.trim();
    this.messages.push({ text: userText, sender: 'user' });
    this.userInput = '';

    // Gửi tới API OpenAI
    this.http.post<any>('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userText }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_OPENAI_API_KEY` // 🔐 THAY BẰNG KHÓA THẬT
      }
    }).subscribe(res => {
      const aiText = res.choices[0].message.content;
      this.messages.push({ text: aiText, sender: 'bot' });
    }, err => {
      this.messages.push({ text: 'Đã xảy ra lỗi khi gọi API.', sender: 'bot' });
    });
  }
}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
  IonItem, IonTextarea, IonButtons, IonButton, IonIcon,
  IonAvatar, IonText, IonSpinner
} from '@ionic/angular/standalone';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
    IonItem, IonTextarea, IonButtons, IonButton, IonIcon,
    IonAvatar, IonText, IonSpinner
  ]
})
export class ChatPage {
  @ViewChild(IonContent) contentArea!: IonContent;
  @ViewChild('chatInput') chatInput!: ElementRef;

  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  private apiKey = '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'; // 👈 Nhớ thay bằng key thực

  constructor(private loadingCtrl: LoadingController) {
    this.initChat(); // Khởi tạo chat khi component được tạo
  }

  // Thêm phương thức initChat()
  private initChat() {
    const savedMessages = localStorage.getItem('chat_history');
    this.messages = savedMessages ? JSON.parse(savedMessages) : [
      { 
        role: 'assistant', 
        content: 'Xin chào! Tôi là AI trợ lý, bạn cần giúp gì?',
        timestamp: new Date() 
      }
    ];
  }

  // ========== Phương thức chính ==========
  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput;
    this.userInput = '';
    this.addMessage('user', userMessage);

    await this.processAIResponse();
  }

  private async processAIResponse() {
    this.isLoading = true;
    const loading = await this.showLoading();

    try {
      const aiResponse = await this.callGroqAPI(this.getLastMessages(10));
      this.addMessage('assistant', aiResponse);
    } catch (error) {
      this.handleAPIError(error);
    } finally {
      this.isLoading = false;
      await loading.dismiss();
      this.scrollToBottom();
      this.saveChatHistory();
    }
  }

  // ========== Xử lý API ==========
  private async callGroqAPI(messages: any[]): Promise<string> {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // Timeout 15s

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Không có phản hồi';

    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  }

  private handleAPIError(error: any) {
    let errorMessage = '⚠️ Lỗi kết nối AI';
    
    if (error.name === 'AbortError') {
      errorMessage = '⏱️ Hết thời gian chờ phản hồi';
    } else if (error.message.includes('401')) {
      errorMessage = '🔑 Lỗi xác thực API Key';
    } else if (error.message.includes('429')) {
      errorMessage = '🔄 Quá nhiều yêu cầu, thử lại sau';
    }

    this.addMessage('assistant', errorMessage);
    console.error('Chi tiết lỗi:', error);
  }

  // ========== Các phương thức hỗ trợ ==========
  private addMessage(role: ChatMessage['role'], content: string) {
    this.messages.push({
      role,
      content,
      timestamp: new Date()
    });
  }

  private getLastMessages(limit: number): ChatMessage[] {
    return this.messages.slice(-limit).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  private async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'AI đang xử lý...',
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

  private scrollToBottom() {
    setTimeout(() => this.contentArea.scrollToBottom(300), 100);
  }

  private saveChatHistory() {
    localStorage.setItem('chat_history', JSON.stringify(this.messages));
  }
}
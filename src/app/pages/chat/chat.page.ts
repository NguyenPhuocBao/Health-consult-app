import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, throwError, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatbotPage {
  userInput = '';
  messages: { text: string; sender: 'user' | 'bot'; error?: boolean }[] = [];
  isLoading = false;
  showTokenInput = true;
  apiKey = '';
  private model = 'vinai/PhoGPT-7B5-Instruct';
  private maxRetries = 2;
  private retryDelay = 15000;
  private lastValidToken: string | null = null;

  constructor(private http: HttpClient) {}

  // Kiểm tra token với cache
  private validateToken(token: string): { valid: boolean; message?: string } {
    if (this.lastValidToken === token) return { valid: true };
    
    if (!token) {
      return { valid: false, message: 'Vui lòng nhập token Hugging Face' };
    }
    if (!token.startsWith('hf_') || token.length < 10) {
      return { valid: false, message: 'Token phải bắt đầu bằng "hf_" và có ít nhất 10 ký tự' };
    }
    return { valid: true };
  }

  async sendMessage() {
    try {
      const input = this.userInput.trim();
      if (!input || this.isLoading) return;

      // Validate token
      const tokenValidation = this.validateToken(this.apiKey);
      if (!tokenValidation.valid) {
        if (!this.showTokenInput) {
          this.showTokenInput = true;
          this.addBotMessage(tokenValidation.message!);
        }
        return;
      }

      this.addUserMessage(input);
      this.userInput = '';
      this.isLoading = true;

      // Gọi API với retry tự động
      const formattedPrompt = this.formatPhoGPTPrompt(input);
      const response = await this.queryAPIWithRetry(formattedPrompt);
      this.handleAPIResponse(response, formattedPrompt);

    } catch (error) {
      await this.handleAPIError(error as HttpErrorResponse);
    } finally {
      this.isLoading = false;
    }
  }

  private formatPhoGPTPrompt(input: string): string {
    const cleanedInput = input.replace(/<s>\[\/?INST\]/g, '').trim();
    return `<s>[INST] ${cleanedInput} [/INST]`;
  }

  private async queryAPIWithRetry(prompt: string, attempt = 0): Promise<any> {
    try {
      const body = {
        inputs: prompt,
        parameters: {
          max_new_tokens: 120,
          temperature: 0.7,  // Giảm nhiệt độ để ổn định hơn
          top_p: 0.9,
          repetition_penalty: 1.1,  // Giảm penalty để tránh lỗi
          do_sample: true,
          return_full_text: false
        }
      };

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      });

      const response$ = this.http.post<any>(
        `https://api-inference.huggingface.co/models/${this.model}`,
        body,
        { headers }
      ).pipe(
        catchError(error => throwError(() => error))
      );

      return await lastValueFrom(response$);

    } catch (error) {
      if (attempt < this.maxRetries && this.isRetryableError(error)) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.queryAPIWithRetry(prompt, attempt + 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    const status = error.status || error.response?.status;
    return status === 503 || status === 429;
  }

  private handleAPIResponse(response: any, prompt: string) {
    if (!response || !Array.isArray(response)) {
      throw new Error('Phản hồi API không hợp lệ');
    }

    let aiText = response[0]?.generated_text || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.';
    aiText = aiText.replace(prompt, '').trim();
    
    if (!aiText) {
      aiText = 'Tôi không có phản hồi cho câu hỏi này. Bạn có thể hỏi cách khác không?';
    }
    
    this.addBotMessage(aiText);
  }

  private async handleAPIError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = 'Đã xảy ra lỗi khi xử lý yêu cầu';
    
    if (error.status === 400) {
      errorMessage = this.parse400Error(error);
    } 
    else if (error.status === 401 || error.status === 403) {
      errorMessage = 'Xác thực thất bại. Vui lòng kiểm tra lại token';
      this.lastValidToken = null;
      this.showTokenInput = true;
    }
    else if (error.status === 503) {
      errorMessage = 'Model đang tải. Vui lòng thử lại sau 15-20 giây...';
    }
    else if (error.status === 429) {
      errorMessage = 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ 1 phút.';
    }

    if (!this.messages.some(m => m.text === errorMessage && m.sender === 'bot')) {
      this.addBotMessage(errorMessage, true);
    }
  }

  private parse400Error(error: HttpErrorResponse): string {
    const errorDetail = error.error?.error?.toLowerCase() || '';
    
    if (errorDetail.includes('invalid input')) {
      return 'Nội dung không hợp lệ. Vui lòng thử cách diễn đạt khác';
    }
    if (errorDetail.includes('too long')) {
      return 'Nội dung quá dài. Vui lòng rút ngắn câu hỏi';
    }
    return 'Yêu cầu không hợp lệ. Vui lòng thử lại';
  }

  private addUserMessage(text: string) {
    this.messages.push({ text, sender: 'user' });
  }

  private addBotMessage(text: string, isError = false) {
    this.messages.push({ text, sender: 'bot', error: isError });
  }

  updateToken(newToken: string) {
    const validation = this.validateToken(newToken);
    if (validation.valid) {
      this.apiKey = newToken.trim();
      this.lastValidToken = this.apiKey;
      this.showTokenInput = false;
      this.addBotMessage('Token đã được cập nhật thành công!');
    } else {
      this.addBotMessage(validation.message || 'Token không hợp lệ', true);
    }
  }
}
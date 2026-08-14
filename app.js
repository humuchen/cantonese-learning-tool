/**
 * 粤语学习工具 - 主应用逻辑
 */

class CantoneseApp {
  constructor() {
    this.currentText = '';
    this.currentJyutping = [];
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
    this.availableVoices = [];
    this.cantoneseVoice = null;
    
    this.initElements();
    this.loadTheme();
    this.bindEvents();
    this.initToneTable();
    this.loadVoices();
  }

  initElements() {
    this.textInput = document.getElementById('textInput');
    this.analyzeBtn = document.getElementById('analyzeBtn');
    this.resultSection = document.getElementById('resultSection');
    this.visualOutput = document.getElementById('visualOutput');
    this.playSentenceBtn = document.getElementById('playSentenceBtn');
    this.slowPlayBtn = document.getElementById('slowPlayBtn');
    this.exportCsvBtn = document.getElementById('exportCsvBtn');
    this.exportAnkiBtn = document.getElementById('exportAnkiBtn');
    this.themeToggle = document.getElementById('themeToggle');
    
    // 语音状态提示
    this.voiceStatusEl = document.createElement('div');
    this.voiceStatusEl.className = 'voice-status';
    document.querySelector('.input-section').appendChild(this.voiceStatusEl);
    
    // 添加测试按钮
    const helpEl = document.createElement('div');
    helpEl.className = 'help-box';
    helpEl.innerHTML = `
      <h3>🔊 语音播放</h3>
      <p>点击汉字卡片播放粤语发音。如果听不到声音，请点击下方测试：</p>
      <button id="testVoiceBtn" class="btn-test">🔊 测试发音</button>
      <span id="voiceStatusText" style="margin-left: 10px; color: #64748b;"></span>
    `;
    document.querySelector('.input-section').appendChild(helpEl);
    
    document.getElementById('testVoiceBtn').addEventListener('click', () => {
      this.testVoice();
    });
  }

  bindEvents() {
    this.analyzeBtn.addEventListener('click', () => this.analyzeText());
    this.playSentenceBtn.addEventListener('click', () => this.playSentence(1));
    this.slowPlayBtn.addEventListener('click', () => this.playSentence(0.5));
    this.exportCsvBtn.addEventListener('click', () => this.exportCSV());
    this.exportAnkiBtn.addEventListener('click', () => this.exportAnki());
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    document.querySelectorAll('.example-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.textInput.value = e.target.dataset.text;
        this.analyzeText();
      });
    });

    this.textInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.analyzeText();
      }
    });
  }

  initToneTable() {
    document.querySelectorAll('.tone-play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.dataset.text;
        this.speak(text);
      });
    });
  }

  loadVoices() {
    const loadVoices = () => {
      this.availableVoices = this.synth.getVoices();
      
      // 查找粤语或中文语音
      this.cantoneseVoice = 
        this.availableVoices.find(v => v.lang.includes('yue')) ||
        this.availableVoices.find(v => v.lang.includes('zh-HK')) ||
        this.availableVoices.find(v => v.lang.includes('zh-TW')) ||
        this.availableVoices.find(v => v.lang.startsWith('zh'));
      
      this.updateVoiceStatus();
    };
    
    if (this.synth.getVoices().length > 0) {
      loadVoices();
    } else {
      this.synth.onvoiceschanged = loadVoices;
    }
    
    setInterval(loadVoices, 3000);
  }

  updateVoiceStatus() {
    if (!this.voiceStatusEl) return;
    
    if (this.cantoneseVoice) {
      this.voiceStatusEl.style.display = 'block';
      this.voiceStatusEl.style.background = '#dcfce7';
      this.voiceStatusEl.style.color = '#166534';
      this.voiceStatusEl.innerHTML = `✅ 检测到语音: ${this.cantoneseVoice.name} (${this.cantoneseVoice.lang})`;
      
      const statusText = document.getElementById('voiceStatusText');
      if (statusText) {
        statusText.textContent = '✓ 语音可用';
        statusText.style.color = '#166534';
      }
    } else {
      this.voiceStatusEl.style.display = 'block';
      this.voiceStatusEl.style.background = '#fef3c7';
      this.voiceStatusEl.style.color = '#92400e';
      this.voiceStatusEl.innerHTML = `⚠️ 未检测到粤语语音包。<br><strong>解决方法：</strong><br>• Windows: 设置 → 时间和语言 → 语音 → 添加「中文（香港）」<br>• macOS: 系统偏好设置 → 语音 → 添加粤语`;
      
      const statusText = document.getElementById('voiceStatusText');
      if (statusText) {
        statusText.textContent = '✗ 使用在线发音服务';
        statusText.style.color = '#d97706';
      }
    }
  }

  testVoice() {
    console.log('测试语音...');
    
    // 尝试多种方式
    let success = false;
    
    // 方式1: Web Speech API
    try {
      const utterance = new SpeechSynthesisUtterance('你好');
      utterance.lang = 'zh-HK';
      if (this.cantoneseVoice) {
        utterance.voice = this.cantoneseVoice;
      }
      
      utterance.onend = () => {
        console.log('语音播放成功');
        success = true;
        this.showTestResult('✅ 语音正常');
      };
      
      utterance.onerror = (e) => {
        console.error('语音错误:', e);
      };
      
      this.synth.speak(utterance);
      
      // 超时检测
      setTimeout(() => {
        if (!success) {
          console.log('语音超时，尝试备选方案');
          this.showTestResult('⚠️ 本地语音不可用，使用在线服务');
          this.speakOnline('你好');
        }
      }, 3000);
      
    } catch (e) {
      console.error('语音测试失败:', e);
      this.showTestResult('❌ 语音功能异常');
    }
  }

  showTestResult(msg) {
    const statusText = document.getElementById('voiceStatusText');
    if (statusText) {
      statusText.textContent = msg;
      statusText.style.color = msg.includes('✅') ? '#166534' :
                               msg.includes('⚠️') ? '#d97706' : '#991b1b';
    }
  }

  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';

    if (isDark) {
      html.removeAttribute('data-theme');
      this.themeToggle.textContent = '🌙 深色模式';
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      this.themeToggle.textContent = '☀️ 浅色模式';
      localStorage.setItem('theme', 'dark');
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      this.themeToggle.textContent = '☀️ 浅色模式';
    }
  }

  analyzeText() {
    let text = this.textInput.value.trim();
    if (!text) {
      alert('请输入中文文本');
      return;
    }

    // 三步转换：简体 → 繁体 → 粤语口语 → Jyutping标注
    const cantoneseText = convertToCantonese(text);
    this.currentText = cantoneseText;
    this.currentJyutping = this.convertToJyutping(cantoneseText);
    this.renderVisual();
    this.resultSection.style.display = 'block';
    this.resultSection.classList.add('fade-in');
    this.exportCsvBtn.disabled = false;
    this.exportAnkiBtn.disabled = false;
  }

  convertToJyutping(text) {
    const result = [];
    let i = 0;
    
    while (i < text.length) {
      if (i + 1 < text.length) {
        const twoChar = text.substring(i, i + 2);
        if (JYUTPING[twoChar]) {
          result.push({ char: twoChar, jyutping: JYUTPING[twoChar], type: 'word' });
          i += 2;
          continue;
        }
      }
      
      const char = text[i];
      if (JYUTPING[char]) {
        result.push({ char, jyutping: JYUTPING[char], type: 'char' });
      } else if (this.isCJK(char)) {
        result.push({ char, jyutping: '', type: 'unknown' });
      } else {
        result.push({ char, jyutping: '', type: 'punctuation' });
      }
      i++;
    }
    
    return result;
  }

  isCJK(char) {
    const code = char.codePointAt(0);
    return code >= 0x4E00 && code <= 0x9FFF;
  }

  getToneNumber(jyutping) {
    if (!jyutping) return 0;
    const match = jyutping.match(/(\d+)$/);
    return match ? parseInt(match[1]) : 0;
  }

  parseJyutping(jyutping) {
    return parseJyutping(jyutping);
  }

  renderVisual() {
    this.visualOutput.innerHTML = '';

    this.currentJyutping.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.dataset.index = index;
      card.dataset.char = item.char;

      const parsed = this.parseJyutping(item.jyutping);
      const tone = parsed.tone;
      const toneColor = tone ? `var(--tone${tone})` : '#94a3b8';

      // 构建拼音显示：声母 + 韵母 + 声调
      const jyutpingDisplay = parsed.initial
        ? `${parsed.initial}${parsed.final}${tone}`
        : (parsed.final ? `${parsed.final}${tone}` : '—');

      card.innerHTML = `
        <div class="char-hanzi" style="color: ${tone ? toneColor : 'var(--text)'}">${item.char}</div>
        <div class="char-pinyin">
          ${parsed.initial ? `<span class="pinyin-initial">${parsed.initial}</span>` : ''}
          ${parsed.final ? `<span class="pinyin-final">${parsed.final}</span>` : ''}
          ${tone ? `<span class="pinyin-tone tone-${tone}">${tone}</span>` : '<span class="pinyin-tone">—</span>'}
        </div>
        <div class="char-meta">
          <span class="meta-initial">${parsed.initial || '∅'}</span>
          <span class="meta-final">${parsed.final || '—'}</span>
          <span class="meta-tone tone-${tone}">T${tone}</span>
        </div>
        ${tone ? `<div class="char-tone-indicator tone-${tone}"></div>` : ''}
      `;

      // 点击发音
      card.addEventListener('click', () => {
        this.speak(item.char);
        card.classList.add('playing');
        setTimeout(() => card.classList.remove('playing'), 300);
      });

      this.visualOutput.appendChild(card);
    });
  }

  speak(text) {
    console.log('播放:', text);
    
    // 先尝试本地语音
    const localSuccess = this.speakLocal(text);
    
    if (!localSuccess) {
      // 回退到在线服务
      setTimeout(() => this.speakOnline(text), 100);
    }
  }

  speakLocal(text) {
    if (!this.synth) {
      console.warn('Web Speech API 不可用');
      return false;
    }
    
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-HK';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    if (this.cantoneseVoice) {
      utterance.voice = this.cantoneseVoice;
    }
    
    utterance.onstart = () => {
      this.isSpeaking = true;
      document.body.classList.add('loading');
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
      document.body.classList.remove('loading');
    };
    
    utterance.onerror = (e) => {
      console.error('本地语音错误:', e);
      this.isSpeaking = false;
      document.body.classList.remove('loading');
    };
    
    try {
      this.synth.speak(utterance);
      return true;
    } catch (e) {
      console.error('播放失败:', e);
      return false;
    }
  }

  async speakOnline(text) {
    console.log('使用在线服务:', text);
    
    try {
      // 使用 Google Translate TTS (允许跨域)
      const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-HK&client=tw-ob&q=${encodeURIComponent(text)}`);
      
      audio.addEventListener('canplay', () => {
        audio.play();
        console.log('在线音频播放成功');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('在线音频加载失败:', e);
        this.showAudioError(text);
      });
      
      // 超时处理
      const timeout = setTimeout(() => {
        audio.pause();
        this.showAudioError(text);
      }, 5000);
      
      audio.addEventListener('ended', () => clearTimeout(timeout));
      audio.addEventListener('pause', () => clearTimeout(timeout));
      
    } catch (e) {
      console.error('在线服务异常:', e);
      this.showAudioError(text);
    }
  }

  showAudioError(text) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'audio-error';
    errorMsg.innerHTML = `⚠️ 无法播放 "${text}" 的发音<br><small>请检查网络连接或语音设置</small>`;
    errorMsg.style.cssText = `
      background: #fee2e2;
      color: #991b1b;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-top: 10px;
    `;
    
    // 显示在输入框下方
    const inputSection = document.querySelector('.input-section');
    inputSection.appendChild(errorMsg);
    
    setTimeout(() => errorMsg.remove(), 4000);
  }

  playSentence(rate = 1) {
    this.speak(this.currentText);
  }

  exportCSV() {
    const lines = ['hanzi,jyutping,pinyin,example'];
    
    this.currentJyutping.forEach(item => {
      if (item.type !== 'punctuation' && item.char.trim()) {
        const pinyin = PINYIN_MAP[item.char] || '';
        const example = EXAMPLES[item.char] || '';
        lines.push(`${item.char},${item.jyutping},${pinyin},${example}`);
      }
    });
    
    this.downloadFile(lines.join('\n'), 'jyutping_export.csv', 'text/csv');
  }

  exportAnki() {
    const lines = ['Hanzi,Jyutping,Pinyin,Example'];
    
    this.currentJyutping.forEach(item => {
      if (item.type !== 'punctuation' && item.char.trim()) {
        const pinyin = PINYIN_MAP[item.char] || '';
        const example = EXAMPLES[item.char] || '';
        lines.push(`${item.char},${item.jyutping},${pinyin},${example}`);
      }
    });
    
    this.downloadFile(lines.join('\n'), 'anki_deck.csv', 'text/csv');
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob(['\ufeff' + content], { type: mimeType + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new CantoneseApp();
  
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
});

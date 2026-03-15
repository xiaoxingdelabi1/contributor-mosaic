class ContributorMosaic {
    constructor() {
        this.contributors = [];
        this.avatarImages = [];
        this.debounceTimer = null;
        this.currentLang = 'zh';
        
        this.elements = {
            repoInput: document.getElementById('repo-input'),
            fetchBtn: document.getElementById('fetch-btn'),
            githubToken: document.getElementById('github-token'),
            columns: document.getElementById('columns'),
            avatarSize: document.getElementById('avatar-size'),
            spacing: document.getElementById('spacing'),
            borderRadius: document.getElementById('border-radius'),
            bgColor: document.getElementById('bg-color'),
            bgColorText: document.getElementById('bg-color-text'),
            padding: document.getElementById('padding'),
            previewContainer: document.getElementById('preview-container'),
            placeholder: document.getElementById('placeholder'),
            canvas: document.getElementById('mosaic-canvas'),
            loading: document.getElementById('loading'),
            stats: document.getElementById('stats'),
            contributorCount: document.getElementById('contributor-count'),
            exportSection: document.getElementById('export-section'),
            exportPng: document.getElementById('export-png'),
            copyHtml: document.getElementById('copy-html'),
            contributorsListSection: document.getElementById('contributors-list-section'),
            contributorsList: document.getElementById('contributors-list'),
            copyListBtn: document.getElementById('copy-list-btn'),
            toast: document.getElementById('toast'),
            langZh: document.getElementById('lang-zh'),
            langEn: document.getElementById('lang-en')
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.syncColorInputs();
        this.setupLanguageSwitcher();
    }

    bindEvents() {
        this.elements.fetchBtn.addEventListener('click', () => this.fetchContributors());
        this.elements.repoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.fetchContributors();
        });

        const controlInputs = [
            this.elements.columns,
            this.elements.avatarSize,
            this.elements.spacing,
            this.elements.borderRadius,
            this.elements.bgColor,
            this.elements.bgColorText,
            this.elements.padding
        ];

        controlInputs.forEach(input => {
            input.addEventListener('input', () => this.debouncedRender());
        });

        this.elements.exportPng.addEventListener('click', () => this.exportPng());
        this.elements.copyHtml.addEventListener('click', () => this.copyHtml());
        this.elements.copyListBtn.addEventListener('click', () => this.copyContributorsList());
    }

    setupLanguageSwitcher() {
        this.elements.langZh.addEventListener('click', () => this.switchLanguage('zh'));
        this.elements.langEn.addEventListener('click', () => this.switchLanguage('en'));
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        
        // Update active button
        this.elements.langZh.classList.toggle('active', lang === 'zh');
        this.elements.langEn.classList.toggle('active', lang === 'en');
        
        // Show/hide elements based on language
        document.querySelectorAll('.lang-zh').forEach(el => {
            el.style.display = lang === 'zh' ? 'block' : 'none';
        });
        
        document.querySelectorAll('.lang-en').forEach(el => {
            el.style.display = lang === 'en' ? 'block' : 'none';
        });
        
        // Update support summary text
        const supportSummary = document.getElementById('support-summary');
        if (supportSummary) {
            supportSummary.textContent = lang === 'zh' ? '赞赏支持' : 'Support';
        }
        
        // Update QR code title
        const qrTitle = document.getElementById('qr-title');
        const qrTitleEn = document.getElementById('qr-title-en');
        if (qrTitle && qrTitleEn) {
            if (lang === 'zh') {
                qrTitle.style.display = 'block';
                qrTitleEn.style.display = 'none';
            } else {
                qrTitle.style.display = 'none';
                qrTitleEn.style.display = 'block';
            }
        }
    }

    syncColorInputs() {
        this.elements.bgColor.addEventListener('input', (e) => {
            this.elements.bgColorText.value = e.target.value;
        });

        this.elements.bgColorText.addEventListener('input', (e) => {
            const value = e.target.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                this.elements.bgColor.value = value;
            }
        });
    }

    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    debouncedRender = this.debounce(() => this.renderMosaic(), 150);

    showToast(message, type = 'info') {
        // 消息映射
        const messages = {
            '请输入 GitHub 仓库地址': {
                zh: '请输入 GitHub 仓库地址',
                en: 'Please enter GitHub repository address'
            },
            '请输入正确的仓库格式，如: owner/repo': {
                zh: '请输入正确的仓库格式，如: owner/repo',
                en: 'Please enter correct repository format, e.g.: owner/repo'
            },
            '未找到贡献者或仓库不存在': {
                zh: '未找到贡献者或仓库不存在',
                en: 'No contributors found or repository does not exist'
            },
            '成功获取': {
                zh: '成功获取',
                en: 'Successfully fetched'
            },
            '位贡献者': {
                zh: '位贡献者',
                en: 'contributors'
            },
            '获取贡献者失败': {
                zh: '获取贡献者失败',
                en: 'Failed to fetch contributors'
            },
            '图片已下载': {
                zh: '图片已下载',
                en: 'Image downloaded'
            },
            'HTML 代码已复制': {
                zh: 'HTML 代码已复制',
                en: 'HTML code copied'
            },
            '贡献者列表已复制': {
                zh: '贡献者列表已复制',
                en: 'Contributors list copied'
            },
            '没有贡献者可复制': {
                zh: '没有贡献者可复制',
                en: 'No contributors to copy'
            }
        };

        // 查找翻译
        let translatedMessage = message;
        for (const [key, translations] of Object.entries(messages)) {
            if (message.includes(key)) {
                if (message.includes('成功获取') && message.includes('位贡献者')) {
                    const count = message.match(/成功获取 (\d+) 位贡献者/)[1];
                    translatedMessage = this.currentLang === 'zh' ? 
                        `成功获取 ${count} 位贡献者` : 
                        `Successfully fetched ${count} contributors`;
                    break;
                }
                translatedMessage = message.replace(key, translations[this.currentLang]);
            }
        }

        this.elements.toast.textContent = translatedMessage;
        this.elements.toast.className = `toast show ${type}`;
        setTimeout(() => {
            this.elements.toast.className = 'toast';
        }, 3000);
    }

    parseRepoInput(input) {
        let repo = input.trim();
        
        if (repo.includes('github.com')) {
            const match = repo.match(/github\.com\/([^/]+\/[^/]+)/);
            if (match) {
                repo = match[1];
            }
        }
        
        repo = repo.replace(/\/$/, '');
        
        if (!/^[^/]+\/[^/]+$/.test(repo)) {
            return null;
        }
        
        return repo;
    }

    async fetchContributors() {
        const repoInput = this.elements.repoInput.value.trim();
        if (!repoInput) {
            this.showToast('请输入 GitHub 仓库地址', 'error');
            return;
        }

        const repo = this.parseRepoInput(repoInput);
        if (!repo) {
            this.showToast('请输入正确的仓库格式，如: owner/repo', 'error');
            return;
        }

        this.elements.fetchBtn.disabled = true;
        this.elements.fetchBtn.textContent = '加载中...';
        this.showLoading(true);
        this.contributors = [];

        try {
            const token = this.elements.githubToken.value.trim();
            const contributors = await this.fetchAllContributors(repo, token);
            
            if (contributors.length === 0) {
                this.showToast('未找到贡献者或仓库不存在', 'error');
                return;
            }

            this.contributors = contributors;
            this.elements.contributorCount.textContent = contributors.length;
            this.elements.stats.style.display = 'block';
            
            await this.loadAvatarImages();
            this.renderMosaic();
            this.renderContributorsList();
            
            this.elements.exportSection.style.display = 'block';
            this.elements.contributorsListSection.style.display = 'block';
            
            this.showToast(`成功获取 ${contributors.length} 位贡献者`, 'success');
        } catch (error) {
            console.error('Error fetching contributors:', error);
            this.showToast(error.message || '获取贡献者失败', 'error');
        } finally {
            this.elements.fetchBtn.disabled = false;
            this.elements.fetchBtn.textContent = '获取贡献者';
            this.showLoading(false);
        }
    }

    async fetchAllContributors(repo, token) {
        const contributors = [];
        let page = 1;
        const perPage = 100;
        let hasMore = true;

        while (hasMore) {
            const url = `https://api.github.com/repos/${repo}/contributors?per_page=${perPage}&page=${page}`;
            const headers = {
                'Accept': 'application/vnd.github.v3+json'
            };

            if (token) {
                headers['Authorization'] = `token ${token}`;
            }

            const response = await fetch(url, { headers });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(this.currentLang === 'zh' ? '仓库不存在或无访问权限' : 'Repository not found or no access');
                } else if (response.status === 403) {
                    throw new Error(this.currentLang === 'zh' ? 'API 限额已用完，请稍后再试或添加 GitHub Token' : 'API rate limit exceeded, please try later or add GitHub Token');
                } else if (response.status === 401) {
                    throw new Error(this.currentLang === 'zh' ? 'GitHub Token 无效' : 'Invalid GitHub Token');
                }
                throw new Error(this.currentLang === 'zh' ? `请求失败: ${response.status}` : `Request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.length === 0) {
                hasMore = false;
            } else {
                contributors.push(...data);
                if (data.length < perPage) {
                    hasMore = false;
                } else {
                    page++;
                }
            }
        }

        return contributors;
    }

    async loadAvatarImages() {
        const size = parseInt(this.elements.avatarSize.value) * 2;
        
        const promises = this.contributors.map(contributor => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                let avatarUrl = contributor.avatar_url;
                if (avatarUrl.includes('githubusercontent.com')) {
                    avatarUrl = `${avatarUrl}&s=${size}`;
                }
                
                img.onload = () => resolve({ img, contributor });
                img.onerror = () => {
                    console.warn(`Failed to load avatar for ${contributor.login}`);
                    resolve({ img: null, contributor });
                };
                img.src = avatarUrl;
            });
        });

        this.avatarImages = await Promise.all(promises);
    }

    showLoading(show) {
        this.elements.loading.style.display = show ? 'block' : 'none';
        this.elements.placeholder.style.display = show ? 'none' : (this.contributors.length > 0 ? 'none' : 'block');
        this.elements.canvas.style.display = show ? 'none' : (this.contributors.length > 0 ? 'block' : 'none');
    }

    renderMosaic() {
        if (this.avatarImages.length === 0) return;

        const columns = parseInt(this.elements.columns.value) || 8;
        const avatarSize = parseInt(this.elements.avatarSize.value) || 64;
        const spacing = parseInt(this.elements.spacing.value) || 8;
        const borderRadius = parseInt(this.elements.borderRadius.value) || 8;
        const bgColor = this.elements.bgColorText.value || '#ffffff';
        const padding = parseInt(this.elements.padding.value) || 16;

        const validImages = this.avatarImages.filter(item => item.img !== null);
        const rows = Math.ceil(validImages.length / columns);

        const canvasWidth = columns * avatarSize + (columns - 1) * spacing + padding * 2;
        const canvasHeight = rows * avatarSize + (rows - 1) * spacing + padding * 2;

        const canvas = this.elements.canvas;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        validImages.forEach((item, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            
            const x = padding + col * (avatarSize + spacing);
            const y = padding + row * (avatarSize + spacing);

            ctx.save();
            
            if (borderRadius > 0) {
                this.roundRect(ctx, x, y, avatarSize, avatarSize, borderRadius);
                ctx.clip();
            }

            ctx.drawImage(item.img, x, y, avatarSize, avatarSize);
            ctx.restore();
        });

        this.elements.placeholder.style.display = 'none';
        this.elements.canvas.style.display = 'block';
    }

    roundRect(ctx, x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    renderContributorsList() {
        const list = this.elements.contributorsList;
        list.innerHTML = '';

        this.contributors.forEach(contributor => {
            const item = document.createElement('div');
            item.className = 'contributor-item';
            item.innerHTML = `
                <img src="${contributor.avatar_url}" alt="${contributor.login}" width="24" height="24">
                <a href="${contributor.html_url}" target="_blank" rel="noopener">${contributor.login}</a>
            `;
            list.appendChild(item);
        });
    }

    exportPng() {
        const canvas = this.elements.canvas;
        const link = document.createElement('a');
        link.download = 'contributors-mosaic.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        this.showToast('图片已下载', 'success');
    }

    copyHtml() {
        const columns = parseInt(this.elements.columns.value) || 8;
        const avatarSize = parseInt(this.elements.avatarSize.value) || 64;
        const spacing = parseInt(this.elements.spacing.value) || 8;
        const borderRadius = parseInt(this.elements.borderRadius.value) || 8;
        const bgColor = this.elements.bgColorText.value || '#ffffff';

        let html = `<!-- Contributors Avatar Wall -->\n`;
        html += `<div style="display: flex; flex-wrap: wrap; gap: ${spacing}px; background: ${bgColor}; padding: 16px; border-radius: 8px;">\n`;

        this.contributors.forEach(contributor => {
            html += `  <a href="${contributor.html_url}" target="_blank" rel="noopener" title="${contributor.login}">
    <img src="${contributor.avatar_url}" alt="${contributor.login}" width="${avatarSize}" height="${avatarSize}" style="border-radius: ${borderRadius}px;">
  </a>\n`;
        });

        html += '</div>';

        this.copyToClipboard(html, 'HTML 代码已复制');
    }

    async copyToClipboard(text, message) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(message, 'success');
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast(message, 'success');
        }
    }

    copyContributorsList() {
        if (this.contributors.length === 0) {
            this.showToast('没有贡献者可复制', 'error');
            return;
        }

        let list = '<!-- Contributors List -->\n';
        list += '<div style="display: flex; flex-wrap: wrap; gap: 12px; max-height: 300px; overflow-y: auto; padding: 4px;">\n';
        
        this.contributors.forEach(c => {
            list += `  <a href="${c.html_url}" target="_blank" rel="noopener" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #f8fafc; border-radius: 6px; text-decoration: none; color: #1e293b; font-size: 14px;">
    <img src="${c.avatar_url}" width="24" height="24" style="border-radius: 50%;" alt="${c.login}">
    <span>${c.login}</span>
  </a>\n`;
        });
        
        list += '</div>';

        this.copyToClipboard(list, '贡献者列表已复制');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ContributorMosaic();
});

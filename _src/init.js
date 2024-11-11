import markdownit from "markdown-it";
import jsyaml from "js-yaml";
import hljs from "highlight.js";
// import { atom } from "nanostores";

hljs.registerLanguage('pseudo', (hljs) => {
    return {
        aliases: ['ps'],
        contains: [
        {
            className: 'comment',
            begin: /#/,
            end: /\s\s|\n|$/,
        },
        {
            className: 'strong',
            begin: /\b[A-Z][A-Z0-9]*\b/,
        },
        {
            className: 'number',
            begin: /\b[0-9]+\b/,
        },
        {
            className: 'leadline',
            begin: /[|/\\=+<>∧∨-]+/,
        },
        ],
    }
});

export const md = markdownit({
    html: true,
    xhtmlOut: true,
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';

        let lines = code.trim().split('\n');
        let tar_line = new Map();
        let code_modified = lines.map((x, i) => {
            if (x.endsWith('/-') || x.endsWith('/+') || x.endsWith('/=')) {
                tar_line.set(i, x[1]);
                x = x.slice(2);
            }
            return x;
        }).join('\n');

        lines = hljs.highlight(code_modified, { language }).value.trim().split('\n');
        return lines.map((x, i) => {
            return `<span class="codeline ${tar_line.get(i) || ''}">${x}</span>\n`;
        }).join('');
    },
});

export const yaml = {
    render: jsyaml.load,
};

// export { atom };
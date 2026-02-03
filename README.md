# Artigo SAD 2026

## Requisitos

- Linux
- Pacotes LaTeX mínimos:
    - `latexmk`
    - `texlive-latex-base`
    - `texlive-latex-recommended`
    - `texlive-latex-extra`
    - `texlive-fonts-recommended`
    - `texlive-lang-portuguese`

### Instalação (Ubuntu/Debian)

```
sudo apt update
sudo apt install -y latexmk texlive-latex-base texlive-latex-recommended \
  texlive-latex-extra texlive-fonts-recommended texlive-lang-portuguese
```

## Como compilar

Na raiz do projeto:

```
latexmk artigo_sad_2026.tex
```

O PDF será gerado em:

```
build/artigo_sad_2026.pdf
```

### Copiar PDF para a raiz do projeto

Para mover o PDF compilado para a raiz do projeto:

```
cp build/artigo_sad_2026.pdf artigo_sad_2026.pdf
```

Ou para fazer isso automaticamente após cada compilação:

```
latexmk artigo_sad_2026.tex && cp build/artigo_sad_2026.pdf artigo_sad_2026.pdf
```

## Observações

- Os arquivos de compilação ficam em `build/` e são ignorados pelo Git.
- Para limpar a saída de compilação:

```
rm -rf build/*
```

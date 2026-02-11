<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1cxXD0P5k7t3cyf4r8B35HNXmPAtke95e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   
## Deploy na Vercel

Para colocar o projeto online na Vercel:

1.  **Repositório GitHub:** Garanta que todas as alterações foram enviadas para o seu GitHub.
2.  **Importar Projeto:** No painel da [Vercel](https://vercel.com), clique em "Add New" -> "Project" e selecione seu repositório.
3.  **Configurar Variáveis de Ambiente:** No passo de "Environment Variables", adicione:
    *   `VITE_SUPABASE_URL`: (Seu link do Supabase)
    *   `VITE_SUPABASE_ANON_KEY`: (Sua chave anon do Supabase)
4.  **Deploy:** Clique em "Deploy".

O arquivo `vercel.json` já foi configurado para gerenciar as rotas do React corretamente.


Atue como um Desenvolvedor Frontend Sênior e UI/UX Designer especializado em Next.js, Tailwind CSS e Framer Motion. A sua tarefa é criar o componente de "Onboarding / Carrossel Inicial" (Landing Screen) do **UniShop**, o marketplace oficial do ISPTEC.

### 🎯 Objetivo da Tela
Criar uma experiência de entrada moderna, fluida e imersiva (estilo aplicação mobile comercial / Super App) que é apresentada aos utilizadores antes de acederem à vitrine principal do sistema. O carrossel deve destacar os principais valores e funcionalidades da plataforma através de um design sofisticado com cores institucionais (Amarelo Ouro `#F59E0B`, Preto Profundo `#000000` e detalhes em Slate/Branco).
 
### 📐 Requisitos Técnicos e Visuais
1. **Layout e Estrutura (Tela Cheia):**
   - O carrossel deve ocupar 100% da largura e altura da viewport (`h-screen w-screen`), com imagens de fundo em alta qualidade e um overlay escuro elegante (gradiente) para garantir legibilidade perfeita do texto.
   - Navegação intuitiva com setas laterais discretas, indicadores de progresso (pontos/dots inferiores) e botões de ação ("Próximo", "Saltar" e "Começar Agora" no último slide).
   - Suporte a gestos de deslizar (*swipe* em dispositivos móveis/touch).

2. **Conteúdo dos 3 Slides do Onboarding:**
   - **Slide 1: Boas-Vindas & Identidade**
     - *Título:* "Bem-vindo ao UniShop ISPTEC"
     - *Subtítulo:* "O marketplace oficial da nossa comunidade acadêmica. Compre, venda e alugue com segurança dentro do campus."
     - *Fundo sugerido:* Imagem corporativa moderna do campus ou estudantes conectados.
   - **Slide 2: Aluguer Seguro com Rastreabilidade**
     - *Título:* "Alugue Materiais com Total Confiança"
     - *Subtítulo:* "Calculadoras científicas, jalecos e livros. Sistema seguro com identificação por número de matrícula e avaliação de reputação entre colegas."
     - *Fundo sugerido:* Ambiente de estudo ou laboratório universitário moderno.
   - **Slide 3: Praticidade & WhatsApp Direto**
     - *Título:* "Negociação Rápida e Direta"
     - *Subtítulo:* "Encontre lanches, material escolar e serviços no seu bloco e sala. Feche negócios num clique direto pelo WhatsApp do fornecedor!"
     - *Fundo sugerido:* Estudantes interagindo no campus ou cantina.

3. **Interatividade e Transições:**
   - Transições suaves entre os slides (efeito *fade* ou *slide horizontal* utilizando animações fluidas).
   - Ao clicar no botão "Começar Agora" (no último slide) ou no botão "Saltar" (em qualquer slide), a aplicação deve disparar um evento ou alterar o estado para ocultar o onboarding e exibir a **Vitrine Principal do UniShop** (armazenando a preferência no `localStorage` para não exibir novamente na mesma sessão).

Gere o código completo do componente em React/Next.js com Tailwind CSS, limpo, modular e totalmente responsivo.
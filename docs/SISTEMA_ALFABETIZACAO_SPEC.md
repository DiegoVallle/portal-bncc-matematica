Aqui está o arquivo completo e unificado em formato Markdown, pronto para você salvar como SISTEMA_ALFABETIZACAO_SPEC.md e subir tanto no repositório/contexto do Claude Code quanto nos prompts do ChatGPT.

Ele integra toda a arquitetura de software, os esquemas TypeScript, os prompts do DALL-E atualizados com a dupla de mascotes (Tuto, a Capivara de mochila azul, e Piti, o Passarinho azul) no estilo livro infantil em guache/lápis de cor e a grade curricular completa com todas as 72 aulas estruturadas bloco a bloco.

# ESPECIFICAÇÃO TÉCNICA E CURRICULAR: SISTEMA DE ALFABETIZAÇÃO DIGITAL (5 A 7 ANOS)
> **Versão:** 2.0 (Consolidada)  
> **Público-Alvo:** Crianças de 5 a 7 anos (Educação Infantil e Anos Iniciais do EF)  
> **Duração Padrão por Sessão:** 15 minutos cronometrados em 4 blocos pedagógicos  
> **Mascotes Oficiais:** Tuto (Capivarinha com mochila azul) e Piti (Passarinho azul)  
> **Estilo Artístico:** Livro de histórias clássico em guache texturizado e lápis de cor  

---

## ÍNDICE
1. [Guia de Operação (Como usar este documento)](#1-guia-de-operação)
2. [Parte 1: Engenharia de Software (Claude Code)](#2-parte-1-engenharia-de-software-claude-code)
   - 2.1 Stack e Requisitos Não Funcionais
   - 2.2 Tipagem TypeScript Global (`types/curriculum.ts`)
   - 2.3 Motores de Jogo Reutilizáveis (Core Engines)
   - 2.4 Prompt de Inicialização para o Claude Code
3. [Parte 2: Direção de Arte e Prompts (ChatGPT / DALL-E)](#3-parte-2-direção-de-arte-e-prompts-chatgpt--dall-e)
   - 3.1 Style Guide & Identidade Visual
   - 3.2 Ficha dos Personagens (Tuto & Piti)
   - 3.3 Prompt Mestre de Estilo (Style Anchor)
   - 3.4 Matriz de Prompts Padronizados por Categoria
   - 3.5 Prompt de Inicialização para o ChatGPT
4. [Parte 3: Grade Curricular Detalhada das 72 Aulas](#4-parte-3-grade-curricular-detalhada-das-72-aulas)
   - Módulo 1: Consciência Fonológica (Aulas 01 a 08)
   - Módulo 2: O Reino das Vogais & Encontros Vocálicos (Aulas 09 a 16)
   - Módulo 3: Consoantes Contínuas & Sílabas Simples CV (Aulas 17 a 28)
   - Módulo 4: Consoantes Oclusivas & Pares Mínimos (Aulas 29 a 40)
   - Módulo 5: Regularidades Ortográficas & Dígrafos (Aulas 41 a 52)
   - Módulo 6: Sílabas Complexas CVC e CCV (Aulas 53 a 64)
   - Módulo 7: Fluência, Interpretação & Alfabetização Plena (Aulas 65 a 72)

---

## 1. GUIA DE OPERAÇÃO

* **Para o Claude Code:** Suba este arquivo na raiz do seu projeto (`/docs/specs.md`) ou forneça-o no contexto inicial para gerar a arquitetura React/TypeScript, os componentes interativos e o arquivo de dados das 72 aulas.
* **Para o ChatGPT:** Copie a [Parte 2](#3-parte-2-direção-de-arte-e-prompts-chatgpt--dall-e) para orientar a geração de artes (via DALL-E 3) e criação dos lotes de imagens para interface, mascotes e vocabulário.

---

## 2. PARTE 1: ENGENHARIA DE SOFTWARE (CLAUDE CODE)

### 2.1 Stack e Requisitos Não Funcionais
* **Framework:** React 19 com TypeScript em modo estrito (`strict: true`) via Vite ou Next.js (App Router).
* **Estilização:** Tailwind CSS v4, com cantos arredondados orgânicos (`rounded-3xl`, `rounded-full`), contraste acessível (WCAG AAA) e áreas de toque mínimas de 64x64px.
* **Animações e Física:** Framer Motion para arrastar e soltar (drag & drop), microinterações táteis e feedback visual.
* **Áudio e Voz:**
  * Web Audio API / HTML5 Audio para execução imediata de fonemas e efeitos sonoros com zero latência.
  * Web Speech API (`webkitSpeechRecognition`) com fallback para `MediaRecorder` nativo para validação de leitura em voz alta.
* **Canvas Interativo:** HTML5 Canvas com cálculo de waypoints e distância Euclidiana para o traçado vetorial de letras.
* **Navegação Sem Texto:** Nenhuma tela essencial para a criança deve depender de leitura de instruções textuais; 100% dos fluxos devem ter locução automática e ícones autoexplicativos.

---

### 2.2 Tipagem TypeScript Global (`types/curriculum.ts`)

```typescript
export type MechanicType = 
  | 'tracing' 
  | 'drag_and_drop' 
  | 'karaoke' 
  | 'speech_match' 
  | 'sound_hunt' 
  | 'syllable_board' 
  | 'minimal_pair_scale';

export type BlockType = 
  | 'warmup' 
  | 'discrimination' 
  | 'construction' 
  | 'oral_production';

export interface Exercise {
  id: string;
  blockType: BlockType;
  durationSeconds: number; // 180 (3 min), 300 (5 min), 240 (4 min)
  title: string;
  audioPromptUrl: string;
  mechanic: MechanicType;
  targetSound?: string;
  targetLetter?: string;
  targetSyllables?: string[];
  targetWords?: string[];
  config: Record<string, any>;
}

export interface Lesson {
  id: number;
  module: number;
  title: string;
  pedagogicalFocus: string;
  durationSeconds: 900; // 15 minutos obrigatórios
  exercises: [Exercise, Exercise, Exercise, Exercise]; // 4 blocos rigorosos
}

export interface UserProgress {
  currentLessonId: number;
  completedLessons: number[];
  unlockedBadges: string[];
  starsAccumulated: number;
  dailyStreak: number;
  accuracyRate: Record<string, number>;
}


2.3 Motores de Jogo Reutilizáveis (Core Engines)

1. <LetterTracer /> (Motor de Traçado Vetorial):
  ⚬ Exibe nós numerados e linha pontilhada guia.
  ⚬ Valida se o ponteiro do usuário (toque ou mouse) atinge o nó seguinte dentro de um raio de tolerância de 32px.
  ⚬ Feedback tátil/sonoro sutil a cada nó conectado; reset suave sem mensagens punitivas em caso de desvio.
2. <PhonemeDragDrop /> (Arrastar e Soltar Silábico):
  ⚬ Utiliza Framer Motion (drag, dragConstraints, dragElastic={0.2}).
  ⚬ Reproduz o áudio do elemento ao tocar/segurar.
  ⚬ Efeito magnético de encaixe no alvo correto. Ao errar, a peça retorna à posição inicial com animação de mola suave (spring).
3. <KaraokeReader /> (Leitor Guiado com Destaque Palavra a Palavra):
  ⚬ Destaca o fundo da palavra atual em tom acolhedor (amarelo manteiga) em sincronia com o áudio nativo ou avanço manual por clique da criança.
  ⚬ Fonte bastão em caixa alta (ex: Lexend Deca ou Andika).
4. <MinimalPairScale /> (Balança Fonológica de Pares Mínimos):
  ⚬ Apresenta duas ilustrações foneticamente parecidas (POTE vs. BOTE).
  ⚬ Reproduz áudio de alta clareza; a criança toca na imagem correspondente. Ao errar, uma dica visual sutil enfatiza a boquinha que articula o fonema.
5. <SpeechValidator /> (Validador de Leitura e Expressão Oral):
  ⚬ Botão de microfone de 96x96px com efeito de onda pulsante.
  ⚬ Validação com tolerância a variações normais de pronúncia da faixa etária de 5 a 7 anos.
  ⚬ Celebração visual com confetes leves via Canvas ao reconhecer a fala.
6. <PlayfulProgressBar /> (Barra de Tempo Lúdica):
  ⚬ Substitui contadores numéricos regressivos por uma barra que enche um pote de mel ou faz o barquinho de madeira dos mascotes navegar pelo rio ao longo dos 15 minutos.

2.4 Prompt de Inicialização para o Claude Code

Atue como Engenheiro Fullstack especialista em aplicações educacionais interativas para o público infantil.
Com base no arquivo de especificação `/docs/specs.md`, vamos implementar a aplicação em React 19 + TypeScript + Tailwind CSS.

Tarefas imediatas:
1. Crie os tipos em `src/types/curriculum.ts` exatamente conforme o schema.
2. Implemente o estado global de progresso (`useUserProgress`) usando Zustand com persistência em LocalStorage.
3. Crie os 5 motores reutilizáveis em `src/components/engines/`:
   - `LetterTracer.tsx`
   - `PhonemeDragDrop.tsx`
   - `KaraokeReader.tsx`
   - `MinimalPairScale.tsx`
   - `SpeechValidator.tsx`
4. Crie o componente `PlayfulProgressBar.tsx` que gerencia os 4 blocos de cada aula totalizando 15 minutos.
5. Popule `src/data/lessonsData.ts` com a estrutura das 72 aulas descritas na especificação curricular.

Certifique-se de que a interface não exija leitura textual de comandos, que todos os botões tenham pelo menos 64x64px e que a navegação seja acompanhada pelos mascotes Tuto e Piti.


3. PARTE 2: DIREÇÃO DE ARTE E PROMPTS (CHATGPT / DALL-E)

3.1 Style Guide & Identidade Visual

⚬ Estilo Artístico: Ilustração de livro infantil clássico em pintura guache suave e textura visível de lápis de cor (children's picture book illustration, soft textured gouache, colored pencil details, visible grain, warm dappled sunlight).
⚬ Sensação Geral: Confortável, artesanal, nostálgica, com texturas táteis que remetem a brinquedos de madeira natural, papel aquarela e natureza.
⚬ Paleta de Cores:
  ⚬ Terrosos e Naturais: Marrom avelã, verde-musgo, amarelo ocre/mostarda, terracota suave.
  ⚬ Tons de Destaque: Azul cobalto suave, azul celeste, vermelho tomate fosco.
⚬ Regra Rígida de Fundo: Todo ativo interativo, botão, mascote ou objeto deve ser gerado isolado em fundo branco puro (isolated on pure white background, no shadows, no frame, no borders), permitindo recorte limpo para PNG transparente. Sem texto, sem letras sobrepostas.

3.2 Ficha dos Personagens

⚬ Tuto (A Capivara):
  ⚬ Filhote de capivara marrom, pelagem com textura de lápis, corpo arredondado e acolhedor.
  ⚬ Focinho largo, olhos fechados em um sorriso calmo e bochechas levemente rosadas.
  ⚬ Veste uma clássica mochila escolar azul com fecho metálico.
  ⚬ Personalidade: Calmo, paciente, acolhedor.
⚬ Piti (O Passarinho Azul):
  ⚬ Passarinho pequenino azul-celeste, bico curto amarelo, bochechas coradas.
  ⚬ Asas expressivas que gesticulam como mãozinhas humanas.
  ⚬ Personalidade: Curioso, enérgico, celebra todas as pequenas vitórias.

3.3 Prompt Mestre de Estilo (Style Anchor)

Sempre utilize este prefixo para garantir consistência visual no DALL-E:

Charming children's picture book illustration, soft gouache and colored pencil style, textured paper feel, gentle warm lighting, cozy storybook aesthetic, hand-drawn details, visible soft grain, clean edges, isolated on pure white background, no text, no letters --v 6.0


3.4 Matriz de Prompts Padronizados por Categoria

A. Mascotes em Estados de Interface

⚬ 1. Comemoração / Sucesso (Final de Aula):
  Charming children's book illustration in soft gouache and colored pencil style: a cute chubby little brown capybara wearing a blue backpack, jumping joyfully alongside an ecstatic tiny blue bird with spread wings, colorful wooden star blocks falling softly around them, warm joyful expressions, cozy grain texture, isolated on pure white background, no text
⚬ 2. Dúvida Gentil / Tente Novamente:
  Charming children's picture book illustration, textured gouache and pencil: a cute brown baby capybara with a blue backpack tilting its head curiously, soft gentle smile, while a tiny blue bird sits on its head looking thoughtful with a wing on its chin, warm cozy aesthetic, isolated on pure white background, no text
⚬ 3. Escuta Ativa (Microfone Ligado):
  Children's storybook illustration in textured gouache style: a friendly cute brown capybara sitting down, holding a cozy wooden flower close to its ear to listen carefully, next to a tiny blue bird wearing soft vintage headphones, quiet attentive atmosphere, isolated on pure white background, no text
⚬ 4. Boas-vindas / Apresentação de Missão:
  Storybook gouache and colored pencil illustration: a cute round brown capybara wearing a blue backpack and a cheerful little blue bird both holding a blank natural wooden signboard together, welcoming and friendly, isolated on pure white background, no text

B. Diagramas Didáticos de Articulação Labial

⚬ Boca /a/ (Aberta):
  Warm storybook style educational illustration: a simple, friendly hand-drawn cartoon child's mouth wide open articulating the vowel sound 'A', textured colored pencil and watercolor style, soft edges, showing clean teeth and tongue position clearly, isolated on pure white background, no letters, no text
⚬ Boca /m/ (Lábios Unidos):
  Warm storybook style educational illustration: a friendly hand-drawn cartoon child's mouth with lips gently pressed together articulating the sound 'MMM', smiling softly, textured colored pencil, clean anatomical position for kids, isolated on pure white background, no text
⚬ Boca /u/ (Biquinho):
  Warm storybook style educational illustration: a simple friendly cartoon child's mouth with small rounded pouted lips articulating the vowel sound 'U', soft gouache and colored pencil style, isolated on pure white background, no text

C. Brinquedos de Madeira e Elementos de Jogo

⚬ Blocos Silábicos de Madeira:
  Pair of vintage tactile wooden toy building blocks for children, painted in warm matte gouache primary colors (blue and yellow), visible natural wood grain and soft painted texture, isolated on pure white background, studio product lighting, no text
⚬ Baú de Madeira com Luz:
  Cozy children's book illustration of a charming rustic wooden toy chest slightly open with a gentle warm glow coming from inside, soft gouache texture, pencil strokes, isolated on pure white background, no text

D. Pares Mínimos e Banco de Imagens

⚬ PATO vs. BATO (Barquinho):
  ⚬ Pato: Charming storybook gouache illustration of a cute little yellow duckling standing proudly, colored pencil outlines, soft warm texture, isolated on pure white background, no text
  ⚬ Barco: Charming children's book illustration of a classic small wooden toy sailboat with a cream canvas sail, gouache and pencil texture, isolated on pure white background, no text
⚬ COLA vs. GOLA:
  ⚬ Cola: Hand-drawn storybook illustration of a friendly vintage school glue bottle made of wood and paper, soft warm colors, colored pencil grain, isolated on pure white background, no text
  ⚬ Gola: Cozy children's storybook illustration of a warm knitted wool sweater with a prominent soft folded collar, textured gouache, isolated on pure white background, no text

E. Selos e Conquistas

⚬ Medalha de Módulo:
  A round collectible storybook badge for children, designed like a handcrafted wooden toy medal with a carved star and a tiny painted blue bird, soft matte gouache colors, organic colored pencil contour, sticker aesthetic, isolated on pure white background, no text

3.5 Prompt de Inicialização para o ChatGPT

Você é o Diretor de Arte do nosso sistema infantil de alfabetização.
Sua missão é gerar os prompts para DALL-E e aprovar os ativos visuais baseando-se estritamente na estética de livro infantil clássico ilustrado em pintura guache suave e lápis de cor texturizado.

Diretrizes obrigatórias:
1. Personagens centrais: Tuto (capivara bebê marrom de mochila azul) e Piti (passarinho azul expressivo).
2. Sem elementos de vetor digital plano moderno, sem 3D brilhante ou plástico; tudo deve parecer analógico, tátil e acolhedor (como blocos de madeira e papel aquarela).
3. Todas as ilustrações devem ser geradas isoladas em fundo branco puro (`isolated on pure white background`), sem molduras, sombras recortadas ou textos escritos.
4. Gere agora a lista detalhada de prompts de imagens para os Módulos 1 e 2.


4. PARTE 3: GRADE CURRICULAR DETALHADA DAS 72 AULAS

Estrutura fixa por aula (15 minutos):

⚬ Bloco 1 (3 min): Aquecimento & Revisão Espaçada
⚬ Bloco 2 (5 min): Discriminação Auditiva e Perceptiva Fina
⚬ Bloco 3 (4 min): Construção Interativa / Manipulação
⚬ Bloco 4 (3 min): Produção Oral, Gravação & Recompensa

MÓDULO 1: Consciência Fonológica & O Despertar dos Sons (Aulas 01 a 08)

Aula 01: Sons do Ambiente e Ritmo

⚬ Bloco 1 (3 min): O Som Oculto. Tocar no objeto que produz o som ouvido (chuva, trovão, sino, latido).
⚬ Bloco 2 (5 min): Bateria de Madeira do Tuto. Repetir sequências rítmicas de 2 a 4 batidas nos tambores de madeira.
⚬ Bloco 3 (4 min): Fábrica Silenciosa. Separar objetos barulhentos (apito, buzina) de silenciosos (algodão, folha) arrastando para cestas.
⚬ Bloco 4 (3 min): Eco do Passarinho Piti. Imitar o som de um animal no microfone; ondas sonoras virtuais fazem flores brotarem.

Aula 02: O Conceito de Rima

⚬ Bloco 1 (3 min): Sons Iguais ou Diferentes. Identificar se dois tons de sino são idênticos.
⚬ Bloco 2 (5 min): Caldeirão de Rimas. Arrastar elementos que rimam com PATO (sapato, gato, prato) para a cesta; descartar copo.
⚬ Bloco 3 (4 min): Ponte das Rimas. Piti precisa atravessar o riacho pisando apenas nas pedras cujas imagens rimam (mão/pão, janela/panela).
⚬ Bloco 4 (3 min): Qual é o Intruso? Clicar na palavra que não rima (sol, caracol, bola) e falar no microfone a palavra restante.

Aula 03: Aliteração (Sons Iniciais Iguais)

⚬ Bloco 1 (3 min): Revisão de Rimas. 3 desafios rápidos de rima para reativar a memória.
⚬ Bloco 2 (5 min): Cesta dos Bichos. Selecionar apenas animais cujo nome começa com o som /s/ (sapo, serpente, sabiá).
⚬ Bloco 3 (4 min): Trenzinho Fonológico. Carregar o vagão apenas com cargas que começam com o som /m/ (mala, maçã, milho).
⚬ Bloco 4 (3 min): Disparo do Som Inicial. Escutar o som isolado de um fonema e falar no microfone uma palavra que inicie com ele.

Aula 04: Consciência de Palavras (Segmentação Frasal)

⚬ Bloco 1 (3 min): Aliteração Rápida. Escolher duas figuras com o mesmo fonema inicial.
⚬ Bloco 2 (5 min): Passos do Tuto. O narrador diz: "O pato nada". A criança dá um toque para cada palavra dita; Tuto dá 3 passos.
⚬ Bloco 3 (4 min): Separador de Blocos. Tocar com uma tesourinha mágica exatamente nos espaços em branco entre blocos de palavras coladas.
⚬ Bloco 4 (3 min): Gravação Frasal Pausada. Repetir a frase no microfone pausadamente; estrelas de madeira acendem para cada palavra falada separadamente.

Aula 05: Consciência Silábica I (Contagem de Sílabas)

⚬ Bloco 1 (3 min): Pulo das Palavras. Pular uma pedra no lago para cada palavra da frase.
⚬ Bloco 2 (5 min): Monstrinho das Sílabas. Alimentar o personagem com palavras de 1, 2 ou 3 pedacinhos (sol = 1, bo-lo = 2, pi-po-ca = 3).
⚬ Bloco 3 (4 min): Cama Elástica do Piti. Tocar na tela a cada sílaba ouvida; parar de pular exatamente quando a palavra terminar.
⚬ Bloco 4 (3 min): Palmas no Microfone. O sistema fala MA-CA-CO; a criança bate palmas e o medidor acústico valida as 3 palmas.

Aula 06: Consciência Silábica II (Manipulação e Subtração)

⚬ Bloco 1 (3 min): Classificação por Tamanho. Separar 4 figuras em caixas de 2 ou 3 sílabas.
⚬ Bloco 2 (5 min): Máquina de Cortar Sílabas. "Se eu tenho SOLDADO e tiro o SOL, o que sobra?" Clicar na imagem do DADO.
⚬ Bloco 3 (4 min): Inversão Silábica. Ouvir sílabas invertidas (LO-BO) e montar a imagem do que virou (BO-LO).
⚬ Bloco 4 (3 min): Completar o Final. O narrador diz SA-PA... e a criança fala no microfone: ...TO!.

Aula 07: Consciência Fonêmica Inicial (Isolamento de Sons)

⚬ Bloco 1 (3 min): Subtração Rápida. Resolver 2 enigmas de palavras sem a sílaba inicial.
⚬ Bloco 2 (5 min): Espelho das Bocas. Clicar na ilustração da boca que articula o fonema sustentado emitido (/aaaa/, /ssss/, /mmmm/).
⚬ Bloco 3 (4 min): Pescaria Fonêmica. Pescar apenas peixes que carregam imagens que iniciam pelo som que a boca no topo está emitindo.
⚬ Bloco 4 (3 min): Sustentação Vocal. Emitir o som /ssss/ contínuo por 3 segundos para acender uma lanterna de vaga-lumes.

Aula 08: Checagem Lúdica da Consciência Fonológica

⚬ Bloco 1 (3 min): Circuito de Rimas. 4 desafios de pareamento rápido.
⚬ Bloco 2 (5 min): Labirinto Silábico. Guiar Tuto pelo caminho pisando apenas em palavras de exatamente 2 sílabas.
⚬ Bloco 3 (4 min): Baú dos Sons. Separar pedras preciosas nos baús de acordo com o som inicial (/a/ vs /m/).
⚬ Bloco 4 (3 min): Abertura do Reino das Letras. Verbalizar as 3 palavras-chave pedidas pelo guardião para desbloquear a Insígnia do Módulo 1.

MÓDULO 2: O Reino das Vogais & Encontros Vocálicos (Aulas 09 a 16)

Aula 09: Fonema e Letra A

⚬ Bloco 1 (3 min): Caça ao Som /a/. Clicar nos desenhos iniciados por /a/ (abelha, anel, abacaxi).
⚬ Bloco 2 (5 min): <LetterTracer /> A. Traçado vetorial maiúsculo com feedback sonoro suave a cada nó conectado.
⚬ Bloco 3 (4 min): Pouso dos Aviões. Pousar aviões com a letra A na pista certa; desviar das outras vogais.
⚬ Bloco 4 (3 min): Emissão Vocálica. Falar "ÁÁÁ" com a boca bem aberta no microfone para abrir a caverna dos cristais.

Aula 10: Fonema e Letra E (Aberto e Fechado)

⚬ Bloco 1 (3 min): Revisão do A. Traçado rápido da letra A em 30 segundos.
⚬ Bloco 2 (5 min): <LetterTracer /> E. Traçar a haste vertical e as 3 horizontais com feedback tátil.
⚬ Bloco 3 (4 min): Som Aberto vs Fechado. Diferenciar auditivamente o /é/ aberto (pé, café) do /ê/ fechado (bebê, mesa).
⚬ Bloco 4 (3 min): Labirinto do Elefante. Conduzir o elefante até o amendoim seguindo os balões da letra E.

Aula 11: Fonema e Letra I

⚬ Bloco 1 (3 min): Duelo A vs E. Classificar objetos entre a Abelha e o Esquilo.
⚬ Bloco 2 (5 min): <LetterTracer /> I. Traçado reto vertical mantendo o traço dentro dos limites da linha.
⚬ Bloco 3 (4 min): Caça-Fantasmas Fonético. Iluminar fantasmas que carregam imagens que iniciam por /i/ (ilha, iglu, ioiô).
⚬ Bloco 4 (3 min): Sorriso no Microfone. Falar "III" bem esticado; o avatar de Piti sorri e bate asas.

Aula 12: Fonema e Letra O (Aberto e Fechado)

⚬ Bloco 1 (3 min): Sequência A-E-I. Colocar as três vogais na ordem correta da trilha.
⚬ Bloco 2 (5 min): <LetterTracer /> O. Desenho circular completo no sentido anti-horário começando do topo.
⚬ Bloco 3 (4 min): Vovô vs Vovó. Ligar imagens com som aberto /ó/ aos óculos da vovó e com som fechado /ô/ ao chapéu do vovô.
⚬ Bloco 4 (3 min): Completar o Início. Preencher a vogal faltante em ilustrações (__nça, __velha).

Aula 13: Fonema e Letra U

⚬ Bloco 1 (3 min): Classificação O vs I. Discriminar formas circulares e retilíneas.
⚬ Bloco 2 (5 min): <LetterTracer /> U. Traçado curvo contínuo descendo pela esquerda e subindo pela direita.
⚬ Bloco 3 (4 min): Biquinho Fonético. Clicar apenas no que começa com o biquinho /u/ (urso, uva, urubu).
⚬ Bloco 4 (3 min): Sustentar o Bico. Segurar o botão de U emitindo voz e soltar dizendo a palavra URSO.

Aula 14: Síntese das 5 Vogais

⚬ Bloco 1 (3 min): Quebra-Cabeça de Madeira. Encaixar as 5 formas das vogais nos seus nichos correspondentes.
⚬ Bloco 2 (5 min): Leitura Labial. Assistir a vídeos curtos das boquinhas em guache sem som e clicar na vogal que foi dita.
⚬ Bloco 3 (4 min): Estouro de Bolhas. Estourar a bolha com a vogal chamada pelo narrador em menos de 3 segundos.
⚬ Bloco 4 (3 min): Lousa Livre. Escrever na tela as 5 vogais ditadas aleatoriamente sem guias de apoio.

Aula 15: Encontros Vocálicos (Ditongos)

⚬ Bloco 1 (3 min): Revisão de Vogais. Tocar na vogal dita no comando de áudio rápido.
⚬ Bloco 2 (5 min): Fusão dos Blocos. Deslizar o bloco A até colidir suavemente com I: "A... I... AI!". Montar EI, OU, AU, OI, UI.
⚬ Bloco 3 (4 min): Balões de Fala. Arrastar o ditongo correto para a cena: tropeço (AI!), latido (AU!), saudação (OI!).
⚬ Bloco 4 (3 min): <KaraokeReader /> de Ditongos. Ler e gravar a sequência de encontros vocálicos apresentada na tela.

Aula 16: O Som Nasal e a Terminação ÃO

⚬ Bloco 1 (3 min): Ditongos Cotidianos. Ligar AU ao cãozinho e OI ao aceno de Piti.
⚬ Bloco 2 (5 min): <LetterTracer /> do Til (~). Traçar a cobrinha do Til e aprender que ela faz o som sair pelo nariz; juntar A + ~ + O = ÃO.
⚬ Bloco 3 (4 min): Barco do ÃO. Carregar o barco de Tuto com caixas que rimam com ÃO (balão, sabão, leão, pão).
⚬ Bloco 4 (3 min): Ditado com Blocos de Madeira. Montar na tela as palavras CÃO, MÃO, PÃO.

MÓDULO 3: Consoantes Contínuas & Sílabas Simples CV (Aulas 17 a 28)

Aula 17: Fonema /m/ e Letra M

⚬ Bloco 1 (3 min): Aquecimento com Ditongos. Ler 3 encontros vocálicos.
⚬ Bloco 2 (5 min): <LetterTracer /> M e Síntese. Traçar o M e juntar com as vogais: MA, ME, MI, MO, MU.
⚬ Bloco 3 (4 min): Completar Sílabas. Arrastar o bloco correto para a palavra: __LA (MOLA), __CO (MACACO).
⚬ Bloco 4 (3 min): Primeiras Palavras Reais. Ler e gravar: MAMA, MÃO, MEU.

Aula 18: Fonema /v/ e Letra V

⚬ Bloco 1 (3 min): Revisão da Família do M. Tocar nos blocos que contêm MA, ME, MI, MO, MU.
⚬ Bloco 2 (5 min): <LetterTracer /> V e Motor /vvv/. Sentir os dentes no lábio e formar VA, VE, VI, VO, VU.
⚬ Bloco 3 (4 min): Estacionamento de Barcos. Estacionar barquinhos silábicos em portos com as figuras certas (vaca, vela, violão, vulcão).
⚬ Bloco 4 (3 min): Decodificação Oral. Leitura das palavras: VAI, VEIO, UVA.

Aula 19: Formando Palavras Reais: M + V

⚬ Bloco 1 (3 min): Pares Silábicos. Ligar MA à maçã e VA à vaca.
⚬ Bloco 2 (5 min): Laboratório de Palavras. Misturar os blocos MO, VA, VE, VI para criar termos reais (MOVE, VIA) e descartar palavras inexistentes.
⚬ Bloco 3 (4 min): Caça-Palavras 3x3. Localizar na grade simples as palavras UVA e MOVA.
⚬ Bloco 4 (3 min): Primeira Frase Lida. Ler no microfone: "A VACA VÊ A UVA".

Aula 20: Fonema /f/ e Letra F

⚬ Bloco 1 (3 min): Classificação M vs V. Separar palavras em duas gavetas.
⚬ Bloco 2 (5 min): <LetterTracer /> F e o Sopro /fff/. Traçar F e soprar a vela na tela para gerar FA, FE, FI, FO, FU.
⚬ Bloco 3 (4 min): Feirinha do F. Colocar na cesta de compras: FITA, FACA, FOGO, FEIJÃO; recusar intrusos.
⚬ Bloco 4 (3 min): Montagem Magnética. Montar as palavras FO-FO-CA e FI-VE-LA e gravar a leitura.

Aula 21: Fonema /l/ e Letra L

⚬ Bloco 1 (3 min): Revisão F. Completar lacunas usando FA, FE ou FO.
⚬ Bloco 2 (5 min): <LetterTracer /> L e a Língua no Céu da Boca. Formação das sílabas LA, LE, LI, LO, LU.
⚬ Bloco 3 (4 min): Dominó Silábico. Conectar o bloco escrito à imagem correspondente (LUA, LATA, LOBO, LUVAS).
⚬ Bloco 4 (3 min): <KaraokeReader /> da Frase. Ler em voz alta: "A FADA VIU A LUA".

Aula 22: Fonema /s/ e Letra S (Sibilante Inicial)

⚬ Bloco 1 (3 min): Diferenciação L vs F. Ouvir se a palavra começou com som /l/ ou /f/.
⚬ Bloco 2 (5 min): <LetterTracer /> S e a Serpente /sss/. Traçado curvo e união com vogais (SA, SE, SI, SO, SU).
⚬ Bloco 3 (4 min): Pulo do Sapo. Piti ajuda o sapo a pular pelas pedras formando: SA-PO, SU-CO, SO-FÁ, SA-LA.
⚬ Bloco 4 (3 min): Caixa Mágica. Ordenar as letras soltas S-U-C-O após comando sonoro.

Aula 23: Mini-História Lida I

⚬ Bloco 1 (3 min): Aquecimento de Decodificação. Ler 4 termos familiares com M, V, F, L, S.
⚬ Bloco 2 (5 min): <KaraokeReader /> de Texto. Ler narrativa de 3 linhas: "O SAPO VÊ A LUA. A LUA É BELA. O SAPO PULA.".
⚬ Bloco 3 (4 min): Interpretação Interativa. Tocar na cena para responder quem viu a lua e o que o sapo fez.
⚬ Bloco 4 (3 min): Audiolivro Pessoal. Gravar a história completa com a voz da criança e ouvir o resultado.

Aula 24: Fonema /z/ e Letra Z

⚬ Bloco 1 (3 min): Contraste S vs Z. Comparar o sopro do S com a vibração da abelhinha Z.
⚬ Bloco 2 (5 min): <LetterTracer /> Z. Traçado em zigue-zague e síntese de ZA, ZE, ZI, ZO, ZU.
⚬ Bloco 3 (4 min): Zoológico do Z. Clicar em placas de animais e objetos com Z (ZEBRA, ZERO, BUZINA, AZUL).
⚬ Bloco 4 (3 min): Montagem Frasal. Ordenar os cartões móveis: "A ZEBRA É VELOZ".

Aula 25: Fonema /n/ e Letra N

⚬ Bloco 1 (3 min): M vs N Visual e Auditivo. Comparar o número de pernas das letras e o ponto de articulação.
⚬ Bloco 2 (5 min): <LetterTracer /> N. Traçar subida, descida e subida; formar NA, NE, NI, NO, NU.
⚬ Bloco 3 (4 min): Carga do Barco. Despachar caixas com nomes iniciados por N (NA-VIO, NO-VE, NU-VEM).
⚬ Bloco 4 (3 min): Ditado no Teclado. Digitar no teclado virtual a palavra NO-VA.

Aula 26: Fonema /r/ Forte Inicial

⚬ Bloco 1 (3 min): Aquecimento N e Z. Leitura rápida de 4 dissílabos.
⚬ Bloco 2 (5 min): <LetterTracer /> R e o Rugido /rrr/. Traçado do R e formação de RA, RE, RI, RO, RU para início de palavras.
⚬ Bloco 3 (4 min): Roleta do R. Girar a roleta e conectar a palavra sorteada à figura certa (RATO, RODA, RUA, REDE).
⚬ Bloco 4 (3 min): Completar Sílaba Inicial. Ouvir ROBÔ e arrastar a sílaba que falta.

Aula 27: Montagem Ativa de Vocabulário

⚬ Bloco 1 (3 min): Classificação dos Sons Contínuos. Arrastar 6 figuras para as caixas de seus sons iniciais.
⚬ Bloco 2 (5 min): Mercadinho de Madeira. Comprar produtos das prateleiras lendo a lista de compras (SUCO, VELA, SALADA).
⚬ Bloco 3 (4 min): Quebra-Cabeça Trissílabo. Juntar 3 partes de madeira: SA-CO-LA, NO-VE-LA, JA-NE-LA.
⚬ Bloco 4 (3 min): Escrita Sem Modelo. Digitar a palavra MEIA guiando-se apenas pela imagem e pelo som.

Aula 28: Consolidação das Consoantes Contínuas

⚬ Bloco 1 (3 min): Caça Rápida. Localizar 3 palavras na tela em menos de 45 segundos.
⚬ Bloco 2 (5 min): Portas da Floresta. Abrir 5 portas lendo palavras-chave com sons contínuos no microfone.
⚬ Bloco 3 (4 min): Sequenciador de Histórias. Ordenar 3 quadros para contar a historinha do ratinho.
⚬ Bloco 4 (3 min): Conquista da Insígnia. Ler 5 palavras seguidas sem interrupção e conquistar a Medalha do Módulo 3.

MÓDULO 4: Consoantes Oclusivas & Pares Mínimos (Aulas 29 a 40)

Aula 29: Fonema /p/ e Letra P

⚬ Bloco 1 (3 min): Revisão Geral. Classificar 4 palavras do módulo anterior.
⚬ Bloco 2 (5 min): Pipoca /p/ e <LetterTracer /> P. Explosão labial sem vibração nas cordas vocais; formar PA, PE, PI, PO, PU.
⚬ Bloco 3 (4 min): Panela de Pipoca. Arrastar milhos com palavras com P (PIPA, PATO, POTE, PUDIM) para estourar.
⚬ Bloco 4 (3 min): Construção Silábica. Montar PI-PA e PI-PO-CA e gravar a leitura.

Aula 30: Fonema /b/ e Letra B

⚬ Bloco 1 (3 min): Leitura da Família do P. Decodificar rapidamente PA, PE, PI, PO, PU.
⚬ Bloco 2 (5 min): Bolhas /b/ e <LetterTracer /> B. Sentir a garganta vibrar e traçar a haste com as duas barrigas; formar BA, BE, BI, BO, BU.
⚬ Bloco 3 (4 min): Estouro de Bolhas. Estourar as bolhas que carregam palavras ditadas (BOLA, BALA, BULE).
⚬ Bloco 4 (3 min): Leitura Frasal. Ler no microfone: "O BEBÊ BABA".

Aula 31: Par Mínimo P vs B (Eliminação de Troca Surda-Sonora)

⚬ Bloco 1 (3 min): Teste do Pescoço. Sentir as cordas vocais desligadas no /p/ e ligadas no /b/.
⚬ Bloco 2 (5 min): <MinimalPairScale /> P vs B. Discriminar auditivamente e selecionar: POTE vs BOTE; PATO vs BATO; PIRO vs BIRO.
⚬ Bloco 3 (4 min): Substituição Transformadora. Trocar o P pelo B na palavra POTE e ver o vaso virar um barquinho de madeira.
⚬ Bloco 4 (3 min): Ditado Relâmpago. Indicar se as palavras ouvidas iniciam com P ou B em menos de 5 segundos.

Aula 32: Fonema /t/ e Letra T

⚬ Bloco 1 (3 min): Aquecimento P/B. Selecionar se BOLO começa com P ou B.
⚬ Bloco 2 (5 min): Tic-Tac /t/ e <LetterTracer /> T. Estalo seco da língua nos dentes sem vibração; formar TA, TE, TI, TO, TU.
⚬ Bloco 3 (4 min): Toca do Tatu. Construir a parede com tijolos de palavras com T (TATU, TOMATE, TAPETE, TELA).
⚬ Bloco 4 (3 min): Gravação Oral. Ler em voz alta: TUCANO, BOTA, LATA.

Aula 33: Fonema /d/ e Letra D

⚬ Bloco 1 (3 min): Revisão do T. Encontrar palavras com T escondidas no relógio.
⚬ Bloco 2 (5 min): O Tambor /d/ e <LetterTracer /> D. Diferenciar o formato do D (uma barriga para a direita) do B; formar DA, DE, DI, DO, DU.
⚬ Bloco 3 (4 min): Dominó do D. Conectar as faces do dado às palavras escritas (DADO, DEDO, DOCE, DIA).
⚬ Bloco 4 (3 min): Leitura em Tela. Ler: "O DADO CAIU NA MESA".

Aula 34: Par Mínimo T vs D

⚬ Bloco 1 (3 min): Teste Laríngeo T/D. Discriminar consoantes dentais surdas e sonoras tocando no pescoço.
⚬ Bloco 2 (5 min): <MinimalPairScale /> T vs D. Discriminação auditiva fina: TELA vs DELA; TATO vs DADO; MOTO vs MODO.
⚬ Bloco 3 (4 min): Conserto de Sentença. "O MENINO MACHUCOU O __EDO". Escolher entre os blocos T e D para dar sentido à frase.
⚬ Bloco 4 (3 min): Sequência Rítmica Falada. Repetir no microfone em tom alternado: "TA-DA, TE-DE, TI-DI, TO-DO, TU-DU".

Aula 35: Fonema /k/ (Letras C e Q)

⚬ Bloco 1 (3 min): Aquecimento T e D. Completar 3 palavras lacradas.
⚬ Bloco 2 (5 min): O Estalo Velar /k/ e <LetterTracer /> C. Formar os sons duros CA, CO, CU e introduzir os blocos QUE, QUI.
⚬ Bloco 3 (4 min): Telhado de Madeira. Posicionar telhas com termos decodificados: CASA, COPO, CUBO, QUEIJO.
⚬ Bloco 4 (3 min): Quebra-Sílabas. Dividir a palavra CA-NE-TA nos nós de separação corretos.

Aula 36: Fonema /g/ (Letra G Gutural)

⚬ Bloco 1 (3 min): Revisão C/Q. Identificar CA, CO, CU no depósito de caixas.
⚬ Bloco 2 (5 min): Garganta Profunda /g/ e <LetterTracer /> G. Sentir o som gutural e formar GA, GO, GU.
⚬ Bloco 3 (4 min): Cuidado dos Animais. Alimentar os bichinhos associando cartões: GATO, GOTA, GALO, GOIABA.
⚬ Bloco 4 (3 min): Montagem Frasal. Ordenar: "O GATO GOSTA DE LEITE".

Aula 37: Par Mínimo C/K vs G

⚬ Bloco 1 (3 min): Sentir a Garganta. Comparar a garganta sem vibração no som /k/ e vibrando no som /g/.
⚬ Bloco 2 (5 min): <MinimalPairScale /> C vs G. Discriminar auditivamente: COLA vs GOLA; CALO vs GALO; CORDA vs GORDA.
⚬ Bloco 3 (4 min): A Máquina de Trocas. Alternar a primeira letra da palavra CAMA para G e ver a animação mudar.
⚬ Bloco 4 (3 min): Ditado Seletivo. Escolher rapidamente entre C ou G após escutar a palavra.

Aula 38: Construção e Mecânica da Frase

⚬ Bloco 1 (3 min): Leitura Relâmpago. Decodificar 5 palavras sorteadas com as consoantes oclusivas.
⚬ Bloco 2 (5 min): Estrutura Sujeito + Ação + Objeto. Construir a frase organizando blocos: [O PATO] [NADA] [NO LAGO].
⚬ Bloco 3 (4 min): Varinha Espaçadora. Tocar nos pontos onde as palavras estão coladas sem espaço para restaurar a segmentação.
⚬ Bloco 4 (3 min): Gravação Natural. Ler a frase construída com ritmo pausado e natural.

Aula 39: Pequenas Histórias Narradas II

⚬ Bloco 1 (3 min): Vocabulário Prévio. Decodificar 3 termos centrais antes de abrir o texto da historinha.
⚬ Bloco 2 (5 min): <KaraokeReader /> de Parágrafo. Leitura guiada: "O CÃO VIU O GATO. O GATO SUBIU NO TOCO. O CÃO LATIU MUITO.".
⚬ Bloco 3 (4 min): Compreensão Explícita. Responder com toques em figuras: "Onde o gato subiu?" e "Quem latiu?".
⚬ Bloco 4 (3 min): Ordem Temporal. Organizar 3 vinhetas ilustrativas nas posições de Início, Meio e Fim.

Aula 40: Conquista do Castelo Alfabético Simples

⚬ Bloco 1 (3 min): Revisão de Todas as Consoantes. Tocar em 6 sílabas aleatórias solicitadas pelo sistema.
⚬ Bloco 2 (5 min): Resgate dos Mascotes. Destrancar 6 caixas decodificando palavras simples no padrão CV (consoante-vogal).
⚬ Bloco 3 (4 min): Legenda Criativa. Falar uma frase para descrever uma imagem da tela e acompanhar o sistema escrevendo as palavras.
⚬ Bloco 4 (3 min): Certificado de Decodificador. Conquista do troféu de madeira e desbloqueio do portal das regularidades ortográficas.

MÓDULO 5: Regularidades Ortográficas & Dígrafos (Aulas 41 a 52)

Aula 41: Fonema /ʒ/ e Letra J

⚬ Bloco 1 (3 min): Diferenciação G vs J. Comparar o som gutural do G (GATO) com o som suave do J.
⚬ Bloco 2 (5 min): <LetterTracer /> J. Traçado com gancho inferior e pingo; síntese de JA, JE, JI, JO, JU.
⚬ Bloco 3 (4 min): Pântano do Jacaré. Pular em pedras com palavras reais: JA-CA-RÉ, JU-JU-BA, JO-GO, JA-NE-LA.
⚬ Bloco 4 (3 min): Lousa Magnética. Formar e verbalizar a palavra TI-JO-LO.

Aula 42: O Som Suave do R (R Brando)

⚬ Bloco 1 (3 min): Revisão do R Inicial. Relembrar o som que arranha a garganta (RATO, RODA).
⚬ Bloco 2 (5 min): A Língua que Treme. Compreender que o R sozinho entre vogais perde a força e treme a língua: ARA, ERE, IRI, ORO, URU.
⚬ Bloco 3 (4 min): Voo do Piti. Clicar em galhos de árvores com palavras com R brando: A-RA-RA, PE-RA, CO-RU-JA, BA-RA-TA.
⚬ Bloco 4 (3 min): Contraste Semântico. Escutar e diferenciar a pronúncia de CARO (preço alto) vs CARRO (veículo).

Aula 43: O Dígrafo RR

⚬ Bloco 1 (3 min): R Forte vs R Fraco. Escutar 3 palavras e apontar se a língua tremeu ou se a garganta arranhou.
⚬ Bloco 2 (5 min): Irmãos Gêmeos Fortes. Regra: para arranhar no meio de duas vogais, o R chama seu irmão gêmeo (CAR-RO, FER-RO, TER-RA).
⚬ Bloco 3 (4 min): Separação nos Vagões. Regra de divisão silábica: os irmãos RR se separam nos vagões (CAR - RO / GAR - RA - FA).
⚬ Bloco 4 (3 min): Ditado com Escolha. Selecionar entre R único (PERA) ou RR duplo (SERRA).

Aula 44: O Dígrafo SS

⚬ Bloco 1 (3 min): Revisão do S Inicial. Confirmar que no início de palavras usa-se apenas um S (SAPO).
⚬ Bloco 2 (5 min): Escudo do SS. Regra: para manter som de serpente entre duas vogais sem chiar como abelha, usa-se SS (PÁS-SA-RO, OS-SO, VAS-SOU-RA).
⚬ Bloco 3 (4 min): Divisão Silábica do SS. Separar os gêmeos do SS em blocos diferentes (OS - SO, PAS - SO).
⚬ Bloco 4 (3 min): Leitura Frasal. Ler: "O MENINO VIU UM PÁSSARO NO GALHO".

Aula 45: O S com Som de Z (Intervocálico)

⚬ Bloco 1 (3 min): Identificação SS. Selecionar rapidamente palavras grafadas com SS.
⚬ Bloco 2 (5 min): O Disfarce da Abelha. Notar que o S sozinho entre vogais ganha o som da abelha Z (CA-SA, ME-SA, RO-SA, VA-SO).
⚬ Bloco 3 (4 min): Porta da Abelha vs Serpente. Separar palavras com som de Z (casa, mesa) das com som de S (sapo, osso).
⚬ Bloco 4 (3 min): Gravação de Precisão. Ler a palavra CASA garantindo a emissão com fonema /z/.

Aula 46: A Família do C Suave (CE e CI)

⚬ Bloco 1 (3 min): Revisão CA, CO, CU. Leitura de 3 palavras com som duro /k/.
⚬ Bloco 2 (5 min): A Mudança com E e I. Observar que o C próximo a E e I assume som de serpente /s/ (CE-NOU-RA, CI-NE-MA, DO-CE).
⚬ Bloco 3 (4 min): Horta do Tuto. Colher vegetais com CE e CI (cenoura, alface, cebola) e descartar os com CA (abóbora).
⚬ Bloco 4 (3 min): Completar Lacunas. Inserir CE ou CI em: VA__NA (VACINA) e DO__ (DOCE).

Aula 47: O Ç (Cedilha)

⚬ Bloco 1 (3 min): Revisão CE/CI. Classificar palavras pelo som suave do C.
⚬ Bloco 2 (5 min): O Rabinho da Cedilha. Aplicação do Ç antes de A, O, U para retomar som de /s/: FACA ➔ FAÇA; COCA ➔ COÇA; LACO ➔ LAÇO.
⚬ Bloco 3 (4 min): Caçador de Erros. Identificar palavras com erro (cedilha nunca inicia palavras e não é usada com E e I).
⚬ Bloco 4 (3 min): Leitura no Circo. Ler termos temáticos: PA-LHA-ÇO, CO-RA-ÇÃO, TA-ÇA.

Aula 48: O Dígrafo CH

⚬ Bloco 1 (3 min): Som de Chuva. Relembrar o som contínuo /ʃ/.
⚬ Bloco 2 (5 min): A Parceria C + H. Compreender que a letra H se junta ao C para produzir o som de chuva (CHA-VE, CHU-VA, CHI-NE-LO).
⚬ Bloco 3 (4 min): Guarda-Chuva de Palavras. Coletar gotas que contêm palavras com CH (CHÁ, CHO-CO-LA-TE); descartar grafias erradas.
⚬ Bloco 4 (3 min): Digitação Assistida. Escrever a palavra CHU-VEI-RO no teclado virtual.

Aula 49: O Dígrafo LH

⚬ Bloco 1 (3 min): Revisão CH. Leitura de 3 termos com som de chuva.
⚬ Bloco 2 (5 min): A Língua Molhada do LH. Junção de L com H gerando som palatal (FO-LHA, MI-LHO, COE-LHO, I-LHA).
⚬ Bloco 3 (4 min): <MinimalPairScale /> LI vs LH. Contraste auditivo e semântico: FILA (pessoas) vs FILHA (família); BOLA vs BOLHA.
⚬ Bloco 4 (3 min): Frase do Coelho. Decodificar no microfone: "O COELHO COMEU A FOLHA NA HORTA".

Aula 50: O Dígrafo NH

⚬ Bloco 1 (3 min): Revisão LH. Ligar MILHO e FOLHA às ilustrações.
⚬ Bloco 2 (5 min): O Som Nasal do NH. Articulação nasal: GA-LI-NHA, NI-NHO, BA-NHO, MI-NHO-CA.
⚬ Bloco 3 (4 min): Ninho dos Passarinhos. Transportar ovos com termos com NH (vizinho, lenha, aranha) para o ninho de Piti.
⚬ Bloco 4 (3 min): Painel dos 3 Dígrafos. Agrupar 6 palavras nas colunas correspondentes de CH, LH e NH.

Aula 51: A Letra X e seus Sons Comuns

⚬ Bloco 1 (3 min): Revisão CH vs X. Identificar termos que compartilham o mesmo fonema /ʃ/.
⚬ Bloco 2 (5 min): O Baú do X. Apresentação do repertório estável com som padrão de /ch/: XÍ-CA-RA, XA-LE, PEI-XE, LI-XO, CAI-XA.
⚬ Bloco 3 (4 min): Pescaria do X. Pescar apenas os peixes que estampam termos grafados com X.
⚬ Bloco 4 (3 min): Ditado Visual. Olhar a ilustração de uma XÍCARA e montar o termo com letras soltas.

Aula 52: Leitura de Quadrinhos e Balões de Fala

⚬ Bloco 1 (3 min): Aquecimento com Dígrafos. Decodificar: CHINELO, BOLHA, NINHO, PEIXE.
⚬ Bloco 2 (5 min): Mini-Gibi com Tuto e Piti. Tocar no balão de fala da tirinha de 3 quadros para expandir o texto e ler com autonomia.
⚬ Bloco 3 (4 min): Atribuição de Falas. Arrastar o balão até o personagem coerente com a narrativa visual.
⚬ Bloco 4 (3 min): Entonação Dramática. Gravar a fala do personagem com expressão de espanto.

MÓDULO 6: Sílabas Complexas (CVC e CCV) (Aulas 53 a 64)

Aula 53: Sílabas Fechadas por R (AR, ER, IR, OR, UR)

⚬ Bloco 1 (3 min): Revisão de Sílabas Abertas. Ler rapidamente RA, RE, RI, RO, RU.
⚬ Bloco 2 (5 min): O Freio da Garganta (CVC). Inversão com vogal antes do R: BAR-CO, CIR-CO, POR-TA, UR-SO, ÁR-VO-RE.
⚬ Bloco 3 (4 min): Boias do Lago. Conduzir o barquinho recolhendo boias com termos em CVC terminados em R (CARTA, PARQUE, SORVETE).
⚬ Bloco 4 (3 min): Contraste Fonológico. Ler em voz alta a diferença entre BABA vs BARBA e CATA vs CARTA.

Aula 54: Sílabas Fechadas por S (AS, ES, IS, OS, US)

⚬ Bloco 1 (3 min): Revisão AR/ER/IR. Localizar 3 palavras com R final de sílaba.
⚬ Bloco 2 (5 min): O Vento Final (AS, ES, IS, OS, US). Pronunciar termos com sílaba travada: ES-CO-LA, VES-TI-DO, MOS-CA, ÓS-CAR.
⚬ Bloco 3 (4 min): Mecânica do Plural. Arrastar a letra S para o fim da palavra e observar os objetos se multiplicarem (O BOLO ➔ OS BOLOS).
⚬ Bloco 4 (3 min): Leitura Oral. Ler: "A MENINA VIU AS ESTRELAS NO CÉU".

Aula 55: Sílabas Fechadas por L (AL, EL, IL, OL, UL)

⚬ Bloco 1 (3 min): Revisão AS/ES/IS. Identificar termos com som sibilante final.
⚬ Bloco 2 (5 min): O L com Som de U. Reconhecer o comportamento fonético do L no fim da sílaba: PA-PEL, A-NEL, SOL, A-ZUL, BAL-DE.
⚬ Bloco 3 (4 min): Classificação Ortográfica L vs U. Separar palavras terminadas em L (anel, pastel) das terminadas na vogal U (chapéu, céu).
⚬ Bloco 4 (3 min): Colar de Palavras. Montar o colar encaixando peças escritas: A-NEL, A-ZUL, CA-RA-COL.

Aula 56: Sílabas Fechadas por M e N (AM, EM, IM, OM, UM)

⚬ Bloco 1 (3 min): Revisão da Nasalização. Resgatar o som anasalado do ÃO.
⚬ Bloco 2 (5 min): Regra M antes de P e B. O mascote ensina: M só dá a mão para P e B (TAM-BOR, POM-BA, CAM-PO). Antes das outras letras, usa-se N (DEN-TE, CIN-TO).
⚬ Bloco 3 (4 min): Semáforo Ortográfico. A palavra aparece lacrada (TA__PA); analisar a letra posterior (P) e clicar no botão M.
⚬ Bloco 4 (3 min): Ditado Fonético. Digitar e conferir a escrita de PUDIM e BOMBA.

Aula 57: Encontros Consonantais com R (PR, TR, BR, CR, FR, GR, DR)

⚬ Bloco 1 (3 min): Aquecimento de Agilidade. Decodificar 4 palavras com sílabas CVC.
⚬ Bloco 2 (5 min): Estrutura CCV com R. A língua treme espremida entre a consoante e a vogal: PRA-TO, TREM, BRIN-CO, CRA-VO, GRI-LO, DRA-GÃO.
⚬ Bloco 3 (4 min): Trilhos do Trem. Construir os trilhos posicionando vagões com encontros consonantais (TRILHO, PRATO, LIVRO, PEDRA).
⚬ Bloco 4 (3 min): <MinimalPairScale /> CV vs CCV. Discriminar auditivamente: PATO vs PRATO; TINTA vs TRINTA; BOCA vs BROCA.

Aula 58: Prática Leitora com Encontros com R

⚬ Bloco 1 (3 min): Revisão CCV. Unir consoantes duplas às vogais (BR + A = BRA).
⚬ Bloco 2 (5 min): Corrida de Barquinhos de Madeira. Ultrapassar competidores ao ler corretamente palavras com encontros com R em até 4 segundos (BRUXA, PREGO, TIGRE, FRUTA).
⚬ Bloco 3 (4 min): Completar com CCV. Selecionar a sílaba faltante para a figura de um dragão entre as opções DA, DURA, DRA.
⚬ Bloco 4 (3 min): Leitura Expressiva. Ler no microfone: "O TIGRE CORREU PARA A PEDRA GRANDE".

Aula 59: Encontros Consonantais com L (PL, BL, CL, FL, GL)

⚬ Bloco 1 (3 min): Diferenciação CCV R vs L. Comparar oralmente: PRA vs PLA; BRA vs BLA.
⚬ Bloco 2 (5 min): Líquida Lateral (CCV L). Articulação deslizante da língua: PLA-CA, FLO-RES-TA, BLU-SA, CLU-BE, GLO-BO.
⚬ Bloco 3 (4 min): Canteiro de Flores. Plantar flores selecionando etiquetas de palavras com L intermediário (FLOR, PLANTA, CLUBE); descartar intrusos com R.
⚬ Bloco 4 (3 min): Desafio Auditivo Par Mínimo. Identificar qual termo foi falado: FORA ou FLORA? PANO ou PLANO?

Aula 60: Palavras Polissílabas (4 ou Mais Sílabas)

⚬ Bloco 1 (3 min): Aquecimento Respiratório. Leitura sucessiva de dissílaba e trissílaba.
⚬ Bloco 2 (5 min): Edifício de Sílabas. Empilhar blocos de termos longos sem perder o fôlego: BOR-BO-LE-TA, BI-CI-CLE-TA, HI-PO-PÓ-TA-MO, A-BA-CA-XI.
⚬ Bloco 3 (4 min): Lâmina de Fatiar. Fazer cortes virtuais exatamente nas divisões silábicas da palavra exibida (TE-LE-FO-NE ➔ 3 quebras).
⚬ Bloco 4 (3 min): Gravação Contínua. Ler termos polissílabos mantendo a regularidade rítmica sem interrupções mecânicas.

Aula 61: Acentos Gráficos (Agudo e Circunflexo)

⚬ Bloco 1 (3 min): Revisão Timbre Aberto e Fechado. Relembrar a diferença auditiva entre sons vocálicos abertos e fechados.
⚬ Bloco 2 (5 min): Grampinho e Chapeuzinho. Acento agudo abre o som (Á-GUA, PI-CO-LÉ, SO-FÁ); circunflexo fecha o som (Ô-NI-BUS, MÊS, LÂM-PA-DA).
⚬ Bloco 3 (4 min): Vovó vs Vovô. Inserir o grampo na VOVÓ e o chapéu no VOVÔ; estender a lógica para MÉDICO e TÊNIS.
⚬ Bloco 4 (3 min): Sílaba Tônica. Tocar na sílaba que soou com maior intensidade na palavra pronunciada.

Aula 62: Fluência de Leitura em Nível de Parágrafo

⚬ Bloco 1 (3 min): Aquecimento de Vocabulário. Ler 3 palavras polissílabas acentuadas.
⚬ Bloco 2 (5 min): Barra de Velocidade. Ler um parágrafo de 4 linhas acompanhando o marcador luminoso calibrado para 45 palavras por minuto.
⚬ Bloco 3 (4 min): Localização Rápida. Tocar na linha exata do texto onde se encontra a palavra solicitada pelo sistema.
⚬ Bloco 4 (3 min): Gravação de Parágrafo. Registrar a leitura do bloco textual inteiro para conferência fonológica automatizada.

Aula 63: Escrita Espontânea Interativa

⚬ Bloco 1 (3 min): Revisão de Teclado. Digitar 3 palavras simples na tela.
⚬ Bloco 2 (5 min): Legenda da Imagem. Observar uma cena de Tuto e Piti na floresta e redigir uma frase descritiva com auxílio corretivo sutil.
⚬ Bloco 3 (4 min): Ajuste Assistido. Tuto orienta a adição de letras esquecidas (ex: consertar BLA para BOLA).
⚬ Bloco 4 (3 min): Publicação da Obra. Inserir a frase criada sob o desenho como legenda oficial na galeria do usuário.

Aula 64: Desafio da Selva das Sílabas Complexas

⚬ Bloco 1 (3 min): Triagem Relâmpago. Classificar 5 palavras difíceis em até 60 segundos.
⚬ Bloco 2 (5 min): A Grande Travessia. Destrancar a ponte lendo 6 cartões que misturam sílabas CVC, CCV e polissílabos.
⚬ Bloco 3 (4 min): Conserto de Armadilhas. Identificar e corrigir 3 frases contendo erros de grafia.
⚬ Bloco 4 (3 min): Troféu de Madeira. Obtenção da Insígnia de Leitor Autônomo e liberação do módulo final.

MÓDULO 7: Fluência, Interpretação & Alfabetização Plena (Aulas 65 a 72)

Aula 65: Pontuação e Entonação I (Ponto Final e Vírgula)

⚬ Bloco 1 (3 min): Leitura Contínua. Ler propositalmente uma frase sem pausas para vivenciar a perda de fôlego.
⚬ Bloco 2 (5 min): Semáforo da Voz. Ponto final (.) representa parada total; vírgula (,) representa pausa breve para respirar. Praticar em: "COMPREI MAÇÃ, PERA E UVA.".
⚬ Bloco 3 (4 min): Inserção de Paradas. Escutar a narração e posicionar os sinais de pontuação nos intervalos acústicos identificados.
⚬ Bloco 4 (3 min): Leitura Guiada. Gravar a oração respeitando os marcadores de pausa luminosos.

Aula 66: Pontuação e Expressividade II (? e !)

⚬ Bloco 1 (3 min): Revisão Ponto Final. Inserir o ponto final em 2 orações afirmativas.
⚬ Bloco 2 (5 min): Dúvida e Espanto. Entonação ascendente na interrogação (?) e enfática na exclamação (!).
⚬ Bloco 3 (4 min): Teatrinho das Emoções. Alternar a entonação da mesma frase conforme a pontuação exibida:
  ⚬ "O bolo caiu." (Afirmação)
  ⚬ "O bolo caiu?" (Pergunta/Dúvida)
  ⚬ "O bolo caiu!" (Espanto/Festa)
⚬ Bloco 4 (3 min): Identificação Auditiva. Escutar áudios expressivos e selecionar o sinal de pontuação correspondente.

Aula 67: Gêneros Textuais Curtos (O Bilhete e a Lista)

⚬ Bloco 1 (3 min): Aquecimento de Leitura. Decodificar 4 palavras cotidianas.
⚬ Bloco 2 (5 min): Anatomia do Bilhete. Identificar destinatário, mensagem e remetente em um bilhete amigável deixado para Tuto.
⚬ Bloco 3 (4 min): Organização de Lista. Classificar itens arrastando palavras de comida para a lista da cesta e brinquedos para a lista do baú.
⚬ Bloco 4 (3 min): Compreensão do Recado. Responder quem enviou o bilhete e qual era o pedido por meio de seleção de cartões ilustrados.

Aula 68: Interpretação de Texto: Informação Explícita

⚬ Bloco 1 (3 min): Leitura Ágil. Decodificar um texto curto de 5 linhas em até 90 segundos.
⚬ Bloco 2 (5 min): Caneta Marca-Texto. Localizar e pintar diretamente no texto a resposta para: "Qual era a cor do sapato do menino?".
⚬ Bloco 3 (4 min): Perguntas Diretas. Resolver 3 questões de múltipla escolha focadas nas ações evidentes dos personagens.
⚬ Bloco 4 (3 min): Resposta Falada. Responder oralmente à pergunta formulada pelo mascote gravando a justificativa.

Aula 69: Interpretação de Texto: Inferências e Humor

⚬ Bloco 1 (3 min): Associação de Pistas. Vincular pistas contextuais aos seus significados.
⚬ Bloco 2 (5 min): Detetive das Entrelinhas. Ler: "O céu ficou cinza escuro e as pessoas abriram guardas-chuvas"; inferir que vai chover sem a palavra "chuva" estar escrita.
⚬ Bloco 3 (4 min): Compreensão de Tirinhas. Ler tirinha cômica de Tuto e Piti e selecionar o motivo pelo qual o desfecho causou riso.
⚬ Bloco 4 (3 min): Projeção Oral. Gravar hipótese sobre o que ocorrerá no dia seguinte aos acontecimentos narrados na história.

Aula 70: Pequena Produção Textual Guiada

⚬ Bloco 1 (3 min): Painel Criativo. Selecionar 1 Personagem + 1 Cenário + 1 Objeto nos seletores ilustrados.
⚬ Bloco 2 (5 min): Redação do Início e Meio. Digitar as primeiras frases da história no teclado virtual estruturando Sujeito e Ação.
⚬ Bloco 3 (4 min): Conclusão Narrativa. Redigir a frase final aplicando letra maiúscula no começo e ponto final ao término.
⚬ Bloco 4 (3 min): Ilustração do Conto. Decorar a história recém-criada com adesivos virtuais de Tuto e Piti.

Aula 71: Leitura Fluente de Livro Digital Ilustrado

⚬ Bloco 1 (3 min): Aquecimento com Prosódia. Leitura expressiva de 2 frases contendo exclamações e interrogações.
⚬ Bloco 2 (5 min): Leitura das Páginas Iniciais. Ler as páginas 1 a 4 do livro digital infantil gravando o áudio página a página.
⚬ Bloco 3 (4 min): Leitura do Clímax e Desfecho. Concluir a leitura das páginas 5 a 8 respeitando a pontuação e mantendo ritmo natural.
⚬ Bloco 4 (3 min): Audiolivro Autoral. O sistema compila as gravações da criança e reproduz a história completa narrada por ela mesma.

Aula 72: Avaliação Final de Alfabetização Plena & Formatura

⚬ Bloco 1 (3 min): Decodificação Rápida. Leitura sucessiva de 10 termos isolados com diferentes padrões silábicos (simples, dígrafos, CVC e CCV).
⚬ Bloco 2 (5 min): Leitura e Interpretação Integral. Ler texto inédito de 8 linhas sem auxílio de locução e responder a 3 questões de interpretação.
⚬ Bloco 3 (4 min): Mensagem Espontânea. Escrever uma frase livre contando qual foi a missão mais divertida de toda a jornada.
⚬ Bloco 4 (3 min): Formatura dos Leitores. Cerimônia interativa com Tuto e Piti comemorando, chuva de confetes, emissão do Diploma Digital de Leitor Pleno com o nome da criança e publicação do livro autoral na biblioteca da família.
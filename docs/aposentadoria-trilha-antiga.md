# Alfabetização: apenas a trilha nova

Pedido de Diego em 18/09/2026: retirar a trilha antiga e deixar só o roteiro novo.

- `/aluno/alfabetizacao` e os antigos endereços por nível/atividade agora redirecionam, após autenticação, para `/aluno/painel`, que já retoma a nova trilha em `/aluno/alfabetizacao/aula/[numero]`.
- A listagem antiga não é mais renderizada. Voltar das aulas novas não reabre os dez níveis antigos.
- As duas Server Actions legadas apenas redirecionam: não registram tentativas nem progresso antigo, inclusive para clientes com abas antigas abertas.
- Registros históricos, modelos e imagens foram preservados. Não houve exclusão de dados ou migração. Matemática permanece intacta nesta alteração.
- O conteúdo dos módulos em desenvolvimento é trabalho separado; esta mudança não os importa ou publica automaticamente.

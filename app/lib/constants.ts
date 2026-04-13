import { ProdutoContrato } from '@/types/nota';

export const PRODUTOS_CONTRATO: ProdutoContrato[] = [
  { id: 1, codigo: 364, nome: 'BANANA MAÇÃ', desconto: 2.20 },
  { id: 2, codigo: 357, nome: 'ABÓBORA KABOTIÁ', desconto: 8.80 },
  { id: 3, codigo: 90539, nome: 'ABÓBORA MORANGA', desconto: 10.30 },
  { id: 4, codigo: 359, nome: 'ABÓBORA PAULISTA', desconto: 10.50 },
  { id: 5, codigo: 111964, nome: 'ABOBRINHA MENINA', desconto: 10.30 },
  { id: 6, codigo: 90548, nome: 'MANGA TOMMY', desconto: 16.65 },
  { id: 7, codigo: 1637, nome: 'PEPINO JAPONÊS', desconto: 10.10 },
  { id: 8, codigo: 416, nome: 'TOMATE LONGA VIDA', desconto: 15.00 },
];

export const STORAGE_KEYS = {
  AUTH: 'auth_hortifruti',
  NOTAS: 'banco_notas_hortifruti',
  NOTA_ATUAL: 'nota_atual_hortifruti',
};
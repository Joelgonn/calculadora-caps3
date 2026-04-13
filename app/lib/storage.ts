import { NotaFiscal } from '@/types/nota';
import { STORAGE_KEYS } from './constants';

export const storage = {
  getAuth: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },
  
  setAuth: (value: boolean) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AUTH, String(value));
  },
  
  removeAuth: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },
  
  getNotas: (): NotaFiscal[] => {
    if (typeof window === 'undefined') return [];
    const notas = localStorage.getItem(STORAGE_KEYS.NOTAS);
    return notas ? JSON.parse(notas) : [];
  },
  
  setNotas: (notas: NotaFiscal[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.NOTAS, JSON.stringify(notas));
  },
  
  getNotaAtual: (): NotaFiscal | null => {
    if (typeof window === 'undefined') return null;
    const nota = localStorage.getItem(STORAGE_KEYS.NOTA_ATUAL);
    return nota ? JSON.parse(nota) : null;
  },
  
  setNotaAtual: (nota: NotaFiscal | null) => {
    if (typeof window === 'undefined') return;
    if (nota) {
      localStorage.setItem(STORAGE_KEYS.NOTA_ATUAL, JSON.stringify(nota));
    } else {
      localStorage.removeItem(STORAGE_KEYS.NOTA_ATUAL);
    }
  },
};
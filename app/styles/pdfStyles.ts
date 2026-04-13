import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#166534',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 2,
  },
  infoSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#374151',
  },
  infoValue: {
    flex: 1,
    color: '#111827',
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#166534',
    color: 'white',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
  },
  colProduto: { width: '20%' },
  colKg: { width: '8%', textAlign: 'center' },
  colValorCx: { width: '10%', textAlign: 'right' },
  colPrecoBase: { width: '10%', textAlign: 'right' },
  colDesconto: { width: '8%', textAlign: 'center' },
  colPrecoFinal: { width: '12%', textAlign: 'right' },
  colQuantidade: { width: '10%', textAlign: 'center' },
  colTotalSemDesc: { width: '10%', textAlign: 'right' },
  colTotal: { width: '12%', textAlign: 'right' },
  totalSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding
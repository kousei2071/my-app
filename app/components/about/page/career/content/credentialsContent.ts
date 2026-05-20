/** 第2章「経歴」内の資格（career/content/ — このファイルだけ編集） */

export type Credential = {
  id: string;
  name: string;
  date: string;
  issuer: string;
  note: string;
};

export const credentials: Credential[] = [
  {
    id: 'aws-clf',
    name: 'AWS CLF',
    date: '2026.05',
    issuer: 'AWS',
    note: 'AWS CLFは、AWSのクラウドプラットフォームを使用するための資格です。',
  },
];

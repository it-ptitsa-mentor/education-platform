export enum ModalStatus {
  Opened = 'Opened',
  Closed = 'Closed',
}

interface Modal {
  text: string;
  status: ModalStatus;
}

export const buildModal = (text: string, status: ModalStatus): Modal => {
  return { text, status };
};

// @ts-check

enum ModalStatus {
  Opened,
  Closed,
}

const buildModal = (
  text: string,
  status: ModalStatus,
): { text: string; status: ModalStatus } => ({ text, status })

export { ModalStatus }
export default buildModal

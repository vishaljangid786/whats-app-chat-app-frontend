type AlertOptions = {
  title: string;
  message: string;
  onConfirm?: () => void;
};

let showCallback: ((options: AlertOptions) => void) | null = null;

export const registerAlert = (
  callback: (options: AlertOptions) => void
) => {
  showCallback = callback;
};

export const showAlert = (options: AlertOptions) => {
  if (showCallback) {
    showCallback(options);
  }
};

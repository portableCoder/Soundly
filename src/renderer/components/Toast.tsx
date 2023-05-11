import React from 'react';
import { ToastContainer, ToastContainerProps, toast } from 'react-toastify';
const Toast = (
  props: ToastContainerProps & React.RefAttributes<HTMLDivElement>
) => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        {...props}
      />
    </>
  );
};

export default Toast;
export { toast };

import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

const InsertPermissionModal = ({ modalPermissionInsertar, setModalPermissionInsertar }) => {
  const insertar = (values) => {
    if (values.descripcion) {
      const postData = {
        descripcion: values.descripcion,
      };
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios
        .post("http://localhost:5126/api/PermissionType", postData, axiosConfig)
        .then((response) => {
          console.log("Respuesta de la API:", response.data);
          setTimeout(() => {
            setModalPermissionInsertar(false);
            location.reload(true);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error al enviar la solicitud POST:", error);
          // Puedes manejar errores aquí si es necesario
        });
    }
  };

  useEffect(() => {
    formik.resetForm();
  }, [modalPermissionInsertar]);

  //****************FORMIK ********************/
  const toast = useRef(null);

  const show = () => {
    toast.current.show({
      severity: "success",
      summary: "Permiso agregado",
      detail: formik.values.descripcion,
    });
  };

  const formik = useFormik({
    initialValues: {
      descripcion: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.descripcion) {
        errors.descripcion = "Descripcion is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      data.descripcion && show(data);
      formik.resetForm();
    },
  });

  const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error mb-4">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };
  //***************** Formik ********************/

  return (
    <Dialog
      header="Insertar Permiso"
      visible={modalPermissionInsertar}
      style={{ width: "50vw" }}
      onHide={() => setModalPermissionInsertar(false)}
    >
      <div className="card flex justify-content-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
            insertar(formik.values);
          }}
          className="flex flex-column gap-2"
        >
          <Toast ref={toast} />

          {/* descripcion */}
          <span className="p-float-label">
            <InputText
              id="descripcion"
              name="descripcion"
              value={formik.values.descripcion}
              onChange={(e) => {
                formik.setFieldValue("descripcion", e.target.value);
              }}
            />
            <label htmlFor="descripcion">Descripcion</label>
          </span>
          {getFormErrorMessage("descripcion")}

          {/* Guardar */}
          <Button type="submit" label="Guardar" />
        </form>
      </div>
    </Dialog>
  );
};

export default InsertPermissionModal;

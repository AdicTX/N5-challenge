import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

const InsertModal = ({ modalInsertar, setModalInsertar }) => {
  const [data, setData] = useState([]);
  const insertar = (values) => {
    if (values.nombre && values.apellido && values.tipo) {
      const fechaActual = new Date().toISOString().split("T")[0];
      const postData = {
        name: values.nombre,
        lastName: values.apellido,
        date: fechaActual,
        typeId: values.tipo.id,
      };
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios
        .post("http://localhost:5126/api/Permission", postData, axiosConfig)
        .then((response) => {
          console.log("Respuesta de la API:", response.data);
          setTimeout(() => {
            setModalInsertar(false);
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
  }, [modalInsertar]);

  //****************FORMIK ********************/
  const toast = useRef(null);

  const show = () => {
    toast.current.show({
      severity: "success",
      summary: "Usuario agregado",
      detail: formik.values.nombre + " " + formik.values.apellido,
    });
  };

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      tipo: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.nombre) {
        errors.nombre = "Name is required.";
      }
      if (!data.apellido) {
        errors.apellido = "Lastname is required.";
      }
      if (!data.tipo) {
        errors.tipo = "Type is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      data.nombre && show(data);
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

  //*************  SELECT  ************/
  useEffect(() => {
    axios
      .get("http://localhost:5126/api/permissionType")
      .then((response) => {
        const data = response.data;
        setData(data);
      })
      .catch((error) => {
        // Manejo de errores
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  return (
    <Dialog
      header="Insertar Usuario"
      visible={modalInsertar}
      style={{ width: "50vw" }}
      onHide={() => setModalInsertar(false)}
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

          {/* Nombre */}
          <span className="p-float-label">
            <InputText
              id="nombre"
              name="nombre"
              value={formik.values.nombre}
              onChange={(e) => {
                formik.setFieldValue("nombre", e.target.value);
              }}
            />
            <label htmlFor="nombre">Nombre</label>
          </span>
          {getFormErrorMessage("nombre")}

          {/* Apellido */}
          <span className="p-float-label">
            <InputText
              id="apellido"
              name="apellido"
              value={formik.values.apellido}
              onChange={(e) => {
                formik.setFieldValue("apellido", e.target.value);
              }}
            />
            <label htmlFor="apellido">Apellido</label>
          </span>
          {getFormErrorMessage("apellido")}

          {/* Tipo */}
          <Dropdown
            id="tipo"
            value={formik.values.tipo}
            onChange={(e) => {
              formik.setFieldValue("tipo", e.target.value);
            }}
            options={data}
            optionLabel="descripcion"
            placeholder="Seleccione tipo"
            className="w-full"
          />
          {getFormErrorMessage("tipo")}

          {/* Guardar */}
          <Button type="submit" label="Guardar" />
        </form>
      </div>
    </Dialog>
  );
};

export default InsertModal;

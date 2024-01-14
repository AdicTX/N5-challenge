import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

const EditModal = ({ modalEditar, setModalEditar, userDataEdit }) => {
  const [data, setData] = useState([]);
  const editar = (values) => {
    if (values.nombre && values.apellido && values.tipopermisoNavigation) {
      const fechaActual = new Date().toISOString().split("T")[0];
      const postData = {
        name: values.nombre,
        lastName: values.apellido,
        date: fechaActual,
        typeId: values.tipopermisoNavigation.id,
      };
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios
        .put(`http://localhost:5126/api/Permission/${userDataEdit.id}`, postData, axiosConfig)
        .then((response) => {
          console.log("Respuesta de la API:", response.data);
          setTimeout(() => {
            setModalEditar(false);
            location.reload(true);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error al enviar la solicitud POST:", error);
        });
    }
  };

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

  useEffect(() => {
    if (userDataEdit) {
      console.log("userDataEdit", userDataEdit);
      formik.setValues({
        id: userDataEdit.id || "",
        nombre: userDataEdit.nombreempleado || "",
        apellido: userDataEdit.apellidoempleado ? userDataEdit.apellidoempleado || "" : "",
        tipopermisoNavigation: userDataEdit.tipopermisoNavigation || "",
      });
    }
  }, [modalEditar]);

  const toast = useRef(null);

  const show = () => {
    toast.current.show({
      severity: "success",
      summary: "Usuario modificado",
      detail: formik.values.nombre + " " + formik.values.apellido,
    });
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      nombre: "",
      apellido: "",
      tipopermisoNavigation: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.nombre) {
        errors.nombre = "Name is required.";
      }
      if (!data.apellido) {
        errors.apellido = "Lastname is required.";
      }
      if (!data.tipopermisoNavigation) {
        errors.tipopermisoNavigation = "Type is required.";
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

  return (
    <Dialog
      header="Editar Usuario"
      visible={modalEditar}
      style={{ width: "50vw" }}
      onHide={() => setModalEditar(false)}
    >
      <div className="card flex justify-content-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
            editar(formik.values);
          }}
          className="flex flex-column gap-2"
        >
          <Toast ref={toast} />

          {/* Id */}
          <span className="p-float-label mb-4">
            <InputText id="id" name="id" disabled value={formik.values.id} />
            <label htmlFor="nombre">Id</label>
          </span>

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

          {/* tipopermisoNavigation */}
          <Dropdown
            id="tipopermisoNavigation"
            value={formik.values.tipopermisoNavigation}
            onChange={(e) => {
              formik.setFieldValue("tipopermisoNavigation", e.target.value);
              console.log(formik.values.tipopermisoNavigation);
            }}
            options={data}
            optionLabel="descripcion"
            placeholder="Seleccione tipo"
            className="w-full"
          />
          {getFormErrorMessage("tipopermisoNavigation")}

          {/* Guardar */}
          <Button type="submit" label="Guardar" />
        </form>
      </div>
    </Dialog>
  );
};

export default EditModal;

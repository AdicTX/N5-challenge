import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CustomerService } from "./service/CustomerService";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import InsertModal from "./InsertModal";
import InsertPermissionModal from "./InsertPermissionModal";
import EditModal from "./EditModal";

export default function Table() {
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalPermissionInsertar, setModalPermissionInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [userDataEdit, setUserDataEdit] = useState(null);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      id: { value: "", matchMode: "contains" },
      nombreempleado: { value: "", matchMode: "contains" },
      apellidoempleado: { value: "", matchMode: "contains" },
      "tipopermisoNavigation.descripcion": { value: "", matchMode: "contains" },
      fechapermiso: { value: "", matchMode: "contains" },
    },
  });

  const onRowClick = (event) => {
    const userId = event.data.id;
    navigateTo(`/usuario/${userId}`);
  };

  const abrirModalInsertar = () => {
    setModalInsertar(true);
  };
  const abrirModalPermissionInsertar = () => {
    setModalPermissionInsertar(true);
  };

  let networkTimeout = null;

  useEffect(() => {
    loadLazyData();
  }, [lazyState]);

  const loadLazyData = () => {
    setLoading(true);

    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }
    networkTimeout = setTimeout(() => {
      CustomerService.getPermissions({
        lazyEvent: JSON.stringify(lazyState),
      }).then((data) => {
        setPermissions(data.data.permissions);
        setLoading(false);
      });
    }, Math.random() * 1000 + 250);
  };

  const representativeBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{rowData.fechapermiso}</span>
      </div>
    );
  };

  const editBodyTemplate = (rowData) => {
    const handleEditButtonClick = () => {
      setUserDataEdit(rowData);
      setModalEditar(true);
    };
    return <Button icon="pi pi-user-edit" onClick={handleEditButtonClick} />;
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt="flag"
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          style={{ width: "24px" }}
        />
        <span>{rowData.apellidoempleado}</span>
      </div>
    );
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <div className="boton-insertar">
          <Button label="Nuevo Usuario" onClick={() => abrirModalInsertar()} />
        </div>
        <div className="boton-insertar">
          <Button label="Nuevo Permiso" onClick={() => abrirModalPermissionInsertar()} />
        </div>
      </div>

      <DataTable
        value={permissions}
        lazy
        dataKey="id"
        loading={loading}
        tableStyle={{ minWidth: "75rem" }}
        selectionMode="single"
        onRowClick={onRowClick}
      >
        {/* <Column selectionMode="single" headerStyle={{ width: 0 }} /> */}
        <Column field="id" header="Id" />
        <Column field="nombreempleado" header="Nombre" />
        <Column field="apellidoempleado" header="Apellido" body={countryBodyTemplate} />
        <Column field="tipopermisoNavigation.descripcion" header="Tipo" />
        <Column field="fechapermiso" header="Fecha" body={representativeBodyTemplate} />
        <Column
          // field="representative.name"
          header="Editar"
          body={editBodyTemplate}
        />
      </DataTable>

      <InsertModal modalInsertar={modalInsertar} setModalInsertar={setModalInsertar} />
      <InsertPermissionModal
        modalPermissionInsertar={modalPermissionInsertar}
        setModalPermissionInsertar={setModalPermissionInsertar}
      />

      <EditModal
        modalEditar={modalEditar}
        setModalEditar={setModalEditar}
        userDataEdit={userDataEdit}
      />
    </div>
  );
}

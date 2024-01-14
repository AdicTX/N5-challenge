import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import AvatarGenerico from "./assets/avatar_generico.jpg";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
const UserCard = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();

  var url = "http://localhost:5126";
  useEffect(() => {
    axios.get(`${url}/api/Permission/${id}`).then((data) => {
      setData(data.data);
    });
  }, []);

  const navigateTo = useNavigate();
  const header = (
    <img
      alt="Card"
      // src={formik.values.avatar?.url ?? AvatarGenerico}
      src={AvatarGenerico}
    />
  );
  const footer = (
    <>
      <Button label="Volver" icon="pi pi-chevron-circle-left" onClick={() => navigateTo(`/`)} />
    </>
  );

  return (
    <div className="card flex justify-content-center">
      <Card
        title={`${data.nombreempleado} ${data.apellidoempleado}`}
        subTitle={`${
          data.tipopermisoNavigation?.descripcion ? data.tipopermisoNavigation?.descripcion : ""
        }`}
        footer={footer}
        header={header}
        className="md:w-25rem"
      ></Card>
    </div>
  );
};
export default UserCard;

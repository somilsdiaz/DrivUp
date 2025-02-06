import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

const Footer: React.FC = () => {
  const FastLinks: { name: string; link: string }[] = [
    { name: "Acerca de nosotros", link: "/acerca-de" },
    { name: "Politica de privacidad", link: "/politicas-de-privacidad" },
    { name: "Terminos y condiciones", link: "#" },
    { name: "FAQ", link: "#" },
    { name: "Contacto", link: "/contacto" },
  ];

  type Input={email:string};
  const {register, handleSubmit, formState:{errors}}=useForm<Input>();

  const onSubmit: SubmitHandler<Input> = (data) => console.log(data);

  return (
    <footer className="z-50 sticky bg-[#CF251F] text-white text-center py-4 flex flex-col gap-4 h-full ">
      <section className="flex justify-between max-[600px]:flex-col max-[600px]:items-center max-[600px]:gap-4">
        <div className="sm:w-1/3 px-2 ">
          <h6 className="text-2xl font-semibold mb-2">Unibus</h6>
          <p>
            Revolucionar el transporte público en Barranquilla mediante una
            plataforma tecnológica que conecte a los usuarios con servicios
            eficientes, optimizando la distribución de la flota en tiempo real y
            mejorando la experiencia de viaje a través del análisis y uso
            inteligente de datos.
          </p>
        </div>
        <div className="sm:w-1/3 px-2">
          <h6 className="text-2xl font-semibold mb-2">Enlaces rápidos</h6>
          <ul>
            {FastLinks.map((link) => (
              <li key={link.name} className=" mb-2">
                <Link className="hover:text-[#FCD116]" to={link.link}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:w-1/3 px-2 flex flex-col items-center gap-4">
          <h6 className="text-2xl font-semibold  mb-2">Síguenos</h6>
          <div className="flex justify-center space-x-4">
            <Link to="#">
              <Facebook />
            </Link>
            <Link to="#">
              <Instagram />
            </Link>
            <Link to="#">
              <Twitter />
            </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex">
                <input
                    type="text"
                    {...register("email",{required:"El correo es requerido",   
                      pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Formato de correo inválido",
                    }})}
                    className="w-2/3 p-2 bg-[#fff] text-[#333] rounded-l-lg border-2 border-[#F5F5F5] focus:outline-none focus:border-[#FCD116]"
                    placeholder="Ingresa tu correo electronico"
                />
               
                <button type="submit" className="bg-[#078930] text-[#333333] hover:bg-[#FCD116] p-2 rounded-r-lg">
                    Suscribirme
                </button>
                </div>
                {errors.email && <span className="text-[#F5F5F5]">{errors.email.message}</span>}
            </form>
          
        </div>
      </section>
      <section className="mx-4 p-2 border-t-2 border-[#F5F5F5]">
        <p>© 2025 UniBus. Todos los derechos reservados.</p>
      </section>
    </footer>
  );
};

export default Footer;

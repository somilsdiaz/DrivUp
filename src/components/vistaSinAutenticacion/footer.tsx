import React from "react";
import { Link } from "react-router-dom";

type LinksProps = {
  name: string;
  link: string;
};

type SectionProps = {
  title: string;
  links: LinksProps[];
};

const Footer: React.FC = () => {
  const footerSections: SectionProps[] = [
    {
      title: "Plataforma",
      links: [
        { name: "Cómo funciona", link: "/como-funciona" },
        { name: "Características", link: "/caracteristicas" },
        { name: "Precios", link: "/precios" },
        { name: "FAQ", link: "/faq" },
      ],
    },
    {
      title: "Compañía",
      links: [
        { name: "Sobre nosotros", link: "/acerca-de" },
        { name: "Carreras", link: "/carreras" },
        { name: "Contacto", link: "/contacto" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Términos del servicio", link: "/terminos-y-condiciones" },
        { name: "Política de privacidad", link: "/politicas-de-privacidad" },
      ],
    },
  ];

  return (
    <footer className="bg-[#4A4E69] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Branding Section */}
        <div className="text-center mb-8">
          <h6 className="text-3xl font-bold mb-2">DrivUp</h6>
          <p className="text-sm">
            Transformando la movilidad urbana con tecnología y comunidad
          </p>
        </div>

        {/* Links Section */}
        <div className="flex justify-between">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-2xl font-semibold mb-4 text-center">{section.title}</h4>
              <ul className="flex gap-5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.link}
                      className="text-[#F5F5F5] hover:text-[#FCD116] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
             
          ))}
        </div>


        {/* Copyright Section */}
        <div className="mt-8 border-t border-[#F5F5F5] pt-4 text-center">
          <p className="text-sm">© 2025 DrivUp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

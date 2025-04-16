import {Shield,Users,Map} from "lucide-react"

type ElegirProps={
 icon:any;
 title:string;
 description:string;
}

export function Elegir() {

  const block:ElegirProps[]=[
   {icon:Shield, title: "Seguridad garantizada", description: `Verificamos a todos nuestros conductores. Requerimos documentos de identidad, licencia de conducir
vigente, seguro vehicular y revisión de antecedentes para
asegurar tu tranquilidad en cada viaje.`},
{icon:Users, title: "Comunidad confiable", description: `Construimos una comunidad basada en la
confianza y el respeto mutuo. Las calificaciones y comentarios
bidireccionales ayudan a mantener altos estándares.`},
{icon:Map, title: "Viajes Eficientes", description: `Nuestra tecnología (para el módulo dinámico)
busca optimizar rutas y agrupar pasajeros inteligentemente,
reduciendo tiempos de espera y costos. El módulo programado te
da control directo para agendar.`}
  ];

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-[#4A4E69] font-bold text-2xl mb-2">
          ¿Por que elegir DrivUp?
        </h2>
        <p>
          Nuestra plataforma está diseñada pensando en la seguridad,
          transparencia y comodidad tanto de pasajeros como de conductores.
        </p>
        <section className="flex max-[768px]:flex-col gap-4 mt-5">
          {block.map((item, index) => (
            <div
              key={index}
              className="border-2 border-[#4A4E69] p-2 py-5 flex-1"
            >
              <div className="flex gap-2">
                <item.icon className="h-8 w-8 text-[#4A4E69] mb-2" />
                <h3 className="text-xl font-bold text-[#4A4E69]">
                  {item.title}
                </h3>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}

import logo from "../assets/unibus-high-resolution-logo-transparent.png"

const LoginPage = () => {
return(
<div className="flex min-h-screen items-center justify-center bg-gray-100">
 <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg border-2"
  style={{borderColor: "#122562"}}
 >
    <div className="flex items-center justify-center ">
       <img src={logo} alt="Logo" className="h-48 w-48 mr-12" />
    </div>
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Iniciar Sesión
    </h2>
    <form>
        <div className="mb-4">
            <label
             htmlFor="email"
             className="block text-gray-700 font-medium mb-2"
            >
                Correo Electrónico
            </label>
            <input
             type="email"
             id="email"
             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             placeholder="tucorreo@dominio.com"
            />
        </div>
        <div className="mb-4">
            <label
             htmlFor="password"
             className="block text-gray-700 font-medium mb-2"
            >
                Contraseña
            </label>
            <input 
             type="password"
             id="password"
             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             placeholder="********"
            />
        </div>
        <button 
         type="submit" 
         className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition" >
            Iniciar Sesión
        </button>
    </form>
    <p className="text-center text-gray-600 mt-4">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </p>
 </div>
</div>
);
};

export default LoginPage;
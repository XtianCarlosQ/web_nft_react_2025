import React from "react";

const ProductDetail = ({ productId }) => {
  // Aquí iría la lógica para cargar los detalles del producto según el ID
  const product = {
    id: "fiber-med-v2",
    name: "FIBER MED V2.0",
    description:
      "Equipo electrónico portátil inteligente para determinación de incidencia de medulación en fibras de origen animal.",
    fullDescription: `
      Sistema de última generación que utiliza Inteligencia Artificial para interpretar imágenes digitales
      y proporcionar resultados automáticos en solo 40 segundos por muestra, procesando más de 3,000 fibras
      simultáneamente.
    `,
    specifications: {
      weight: "11 kg",
      dimensions: "Portátil",
      power: "220–240 VAC / 50–60 Hz",
      camera: "Infrarroja",
      components: ["Electrónico", "Mecánico", "Óptico", "Programación"],
    },
    features: [
      "Resultados en 40 segundos por muestra",
      "Caracteriza más de 3,000 fibras/muestra",
      "Compatible con fibras de diferentes colores",
      "Utiliza IA para interpretación de imágenes",
      "Portátil y fácil de transportar",
    ],
    measurements: [
      "Porcentaje de medulación total (PMT)",
      "Porcentaje de la media de diámetro de fibras total (%MDFT)",
      "Clasificación por tipos de medulación",
      "Histogramas de diámetro de fibras",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex space-x-2 text-gray-600">
            <li>
              <a href="/" className="hover:text-red-600">
                Inicio
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/productos" className="hover:text-red-600">
                Productos
              </a>
            </li>
            <li>/</li>
            <li className="text-red-600">{product.name}</li>
          </ol>
        </nav>

        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                {/* Placeholder para imagen del producto */}
                <svg
                  className="w-48 h-48 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
            </div>
            <div className="p-8 md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors">
                Solicitar Cotización
              </button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Specifications */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Especificaciones Técnicas
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-medium text-gray-700">Peso</dt>
                <dd className="mt-1 text-gray-600">
                  {product.specifications.weight}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Alimentación</dt>
                <dd className="mt-1 text-gray-600">
                  {product.specifications.power}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Cámara</dt>
                <dd className="mt-1 text-gray-600">
                  {product.specifications.camera}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Componentes</dt>
                <dd className="mt-1 text-gray-600">
                  {product.specifications.components.join(", ")}
                </dd>
              </div>
            </dl>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Características
            </h2>
            <ul className="space-y-4">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-600 mr-3 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Measurements */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Mediciones y Análisis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.measurements.map((measurement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{measurement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

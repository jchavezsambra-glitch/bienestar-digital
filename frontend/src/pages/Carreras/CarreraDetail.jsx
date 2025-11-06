import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { carreraService } from '../../services/api'

const CarreraDetail = () => {
  const { id } = useParams()
  const { data: carrera, isLoading } = useQuery({
    queryKey: ['carrera', id],
    queryFn: () => carreraService.getById(id),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!carrera) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Carrera no encontrada</p>
        <Link to="/carreras" className="text-primary-600 mt-4 inline-block">
          Volver a carreras
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <Link
        to="/carreras"
        className="text-primary-600 hover:text-primary-800 mb-4 inline-block"
      >
        ← Volver a carreras
      </Link>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">{carrera.nombre}</h1>
          <p className="mt-2 text-lg text-gray-600">{carrera.universidad}</p>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line">{carrera.descripcion}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Duración</h3>
              <p className="text-gray-700">{carrera.duracion}</p>
            </div>

            {carrera.areas_interes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Áreas de Interés</h3>
                <p className="text-gray-700">{carrera.areas_interes}</p>
              </div>
            )}
          </div>

          {carrera.requisitos && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Requisitos</h3>
              <p className="text-gray-700 whitespace-pre-line">{carrera.requisitos}</p>
            </div>
          )}

          {carrera.campo_laboral && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Campo Laboral</h3>
              <p className="text-gray-700 whitespace-pre-line">{carrera.campo_laboral}</p>
            </div>
          )}

          {carrera.habilidades_necesarias && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Habilidades Necesarias</h3>
              <p className="text-gray-700 whitespace-pre-line">{carrera.habilidades_necesarias}</p>
            </div>
          )}

          {carrera.link_info && (
            <div>
              <a
                href={carrera.link_info}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Más información →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CarreraDetail




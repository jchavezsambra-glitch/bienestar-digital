import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { carreraService } from '../../services/api'

const Carreras = () => {
  const { data: carreras, isLoading } = useQuery({
    queryKey: ['carreras'],
    queryFn: carreraService.getAll,
  })

  const listaCarreras = carreras?.results || carreras || []

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carreras Universitarias</h1>
        <p className="mt-2 text-gray-600">
          Explora las diferentes opciones de carreras disponibles
        </p>
      </div>

      {listaCarreras.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay carreras disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listaCarreras.map((carrera) => (
            <Link
              key={carrera.id}
              to={`/carreras/${carrera.id}`}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {carrera.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{carrera.universidad}</p>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                  {carrera.descripcion}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Duración: {carrera.duracion}</span>
                  <span className="text-primary-600 text-sm font-medium">
                    Ver detalles →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Carreras




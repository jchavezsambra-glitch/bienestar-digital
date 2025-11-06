import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { anuncioService, carreraService } from '../../services/api'

const Dashboard = () => {
  const { data: anuncios } = useQuery({
    queryKey: ['anuncios'],
    queryFn: anuncioService.getAll,
  })

  const { data: carreras } = useQuery({
    queryKey: ['carreras'],
    queryFn: carreraService.getAll,
  })

  const anunciosRecientes = anuncios?.results?.slice(0, 5) || anuncios?.slice(0, 5) || []

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido a Bienestar Digital - Tu plataforma de orientación vocacional
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">🎓</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Carreras disponibles
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {carreras?.results?.length || carreras?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">📢</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Anuncios activos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {anuncios?.results?.length || anuncios?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">📚</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recursos disponibles
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">+</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Anuncios recientes */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Anuncios Recientes
          </h3>
          <div className="space-y-4">
            {anunciosRecientes.length > 0 ? (
              anunciosRecientes.map((anuncio) => (
                <div
                  key={anuncio.id}
                  className="border-l-4 border-primary-500 bg-gray-50 p-4 rounded"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {anuncio.titulo}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {anuncio.contenido}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        {anuncio.link_zoom && (
                          <a
                            href={anuncio.link_zoom}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-800"
                          >
                            🔗 Zoom
                          </a>
                        )}
                        {anuncio.link_encuesta && (
                          <a
                            href={anuncio.link_encuesta}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-800"
                          >
                            📝 Encuesta
                          </a>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/anuncios/${anuncio.id}`}
                      className="ml-4 text-sm font-medium text-primary-600 hover:text-primary-800"
                    >
                      Ver más →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No hay anuncios disponibles</p>
            )}
          </div>
          <div className="mt-4">
            <Link
              to="/anuncios"
              className="text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              Ver todos los anuncios →
            </Link>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/carreras"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
        >
          <div className="flex-shrink-0">
            <span className="text-4xl">🎓</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">Explorar Carreras</p>
            <p className="text-sm text-gray-500 truncate">
              Descubre las diferentes opciones de carreras universitarias
            </p>
          </div>
        </Link>

        <Link
          to="/anuncios"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
        >
          <div className="flex-shrink-0">
            <span className="text-4xl">📢</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">Ver Anuncios</p>
            <p className="text-sm text-gray-500 truncate">
              Mantente al día con los últimos anuncios y recursos
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard




import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { anuncioService } from '../../services/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const Anuncios = () => {
  const { data: anuncios, isLoading } = useQuery({
    queryKey: ['anuncios'],
    queryFn: anuncioService.getAll,
  })

  const listaAnuncios = anuncios?.results || anuncios || []

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
        <h1 className="text-3xl font-bold text-gray-900">Anuncios</h1>
        <p className="mt-2 text-gray-600">
          Mantente informado con los últimos anuncios y recursos
        </p>
      </div>

      {listaAnuncios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay anuncios disponibles</p>
        </div>
      ) : (
        <div className="space-y-6">
          {listaAnuncios.map((anuncio) => (
            <div
              key={anuncio.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {anuncio.tipo === 'zoom' ? '🔗 Zoom' :
                         anuncio.tipo === 'encuesta' ? '📝 Encuesta' :
                         anuncio.tipo === 'recurso' ? '📚 Recurso' : '📢 General'}
                      </span>
                      {anuncio.fecha_publicacion && (
                        <span className="text-sm text-gray-500">
                          {format(new Date(anuncio.fecha_publicacion), "d 'de' MMMM yyyy", { locale: es })}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {anuncio.titulo}
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line mb-4">
                      {anuncio.contenido}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {anuncio.link_zoom && (
                        <a
                          href={anuncio.link_zoom}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
                        >
                          🔗 Abrir Zoom
                        </a>
                      )}
                      {anuncio.link_encuesta && (
                        <a
                          href={anuncio.link_encuesta}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
                        >
                          📝 Abrir Encuesta
                        </a>
                      )}
                      {anuncio.link_recurso && (
                        <a
                          href={anuncio.link_recurso}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
                        >
                          📚 Ver Recurso
                        </a>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/anuncios/${anuncio.id}`}
                    className="ml-4 text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Ver más →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Anuncios




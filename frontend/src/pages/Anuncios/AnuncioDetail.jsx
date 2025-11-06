import { useQuery } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { anuncioService } from '../../services/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect } from 'react'

const AnuncioDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const { data: anuncio, isLoading } = useQuery({
    queryKey: ['anuncio', id],
    queryFn: () => anuncioService.getById(id),
  })

  useEffect(() => {
    // Registrar vista cuando se carga el anuncio
    if (anuncio) {
      anuncioService.registrarVista(id).catch(() => {
        // Ignorar errores al registrar vista
      })
    }
  }, [anuncio, id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!anuncio) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Anuncio no encontrado</p>
        <Link to="/anuncios" className="text-primary-600 mt-4 inline-block">
          Volver a anuncios
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <Link
        to="/anuncios"
        className="text-primary-600 hover:text-primary-800 mb-4 inline-block"
      >
        ← Volver a anuncios
      </Link>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {anuncio.tipo === 'zoom' ? '🔗 Zoom' :
                   anuncio.tipo === 'encuesta' ? '📝 Encuesta' :
                   anuncio.tipo === 'recurso' ? '📚 Recurso' : '📢 General'}
                </span>
                {anuncio.fecha_publicacion && (
                  <span className="text-sm text-gray-500">
                    {format(new Date(anuncio.fecha_publicacion), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{anuncio.titulo}</h1>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line mb-6">{anuncio.contenido}</p>

            <div className="space-y-4">
              {anuncio.link_zoom && (
                <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2">Link de Zoom</h3>
                  <a
                    href={anuncio.link_zoom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    🔗 Abrir reunión de Zoom
                  </a>
                </div>
              )}

              {anuncio.link_encuesta && (
                <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2">Encuesta</h3>
                  <a
                    href={anuncio.link_encuesta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    📝 Abrir encuesta
                  </a>
                </div>
              )}

              {anuncio.link_recurso && (
                <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2">Recurso Educativo</h3>
                  <a
                    href={anuncio.link_recurso}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    📚 Ver recurso
                  </a>
                </div>
              )}
            </div>

            {anuncio.fecha_expiracion && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Fecha de expiración:</strong>{' '}
                  {format(new Date(anuncio.fecha_expiracion), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnuncioDetail




import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { anuncioService } from '../../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const AdminAnuncios = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingAnuncio, setEditingAnuncio] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    tipo: 'general',
    link_zoom: '',
    link_encuesta: '',
    link_recurso: '',
    fecha_publicacion: '',
    fecha_expiracion: '',
    activo: true,
  })

  const queryClient = useQueryClient()

  const { data: anuncios, isLoading } = useQuery({
    queryKey: ['anuncios'],
    queryFn: anuncioService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: anuncioService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['anuncios'])
      toast.success('Anuncio creado exitosamente')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Error al crear anuncio')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => anuncioService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['anuncios'])
      toast.success('Anuncio actualizado exitosamente')
      setShowModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Error al actualizar anuncio')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: anuncioService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['anuncios'])
      toast.success('Anuncio eliminado exitosamente')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Error al eliminar anuncio')
    },
  })

  const resetForm = () => {
    setFormData({
      titulo: '',
      contenido: '',
      tipo: 'general',
      link_zoom: '',
      link_encuesta: '',
      link_recurso: '',
      fecha_publicacion: '',
      fecha_expiracion: '',
      activo: true,
    })
    setEditingAnuncio(null)
  }

  const handleEdit = (anuncio) => {
    setEditingAnuncio(anuncio)
    setFormData({
      titulo: anuncio.titulo || '',
      contenido: anuncio.contenido || '',
      tipo: anuncio.tipo || 'general',
      link_zoom: anuncio.link_zoom || '',
      link_encuesta: anuncio.link_encuesta || '',
      link_recurso: anuncio.link_recurso || '',
      fecha_publicacion: anuncio.fecha_publicacion
        ? format(new Date(anuncio.fecha_publicacion), "yyyy-MM-dd'T'HH:mm")
        : '',
      fecha_expiracion: anuncio.fecha_expiracion
        ? format(new Date(anuncio.fecha_expiracion), "yyyy-MM-dd'T'HH:mm")
        : '',
      activo: anuncio.activo !== undefined ? anuncio.activo : true,
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingAnuncio) {
      updateMutation.mutate({ id: editingAnuncio.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este anuncio?')) {
      deleteMutation.mutate(id)
    }
  }

  const listaAnuncios = anuncios?.results || anuncios || []

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestionar Anuncios</h1>
          <p className="mt-2 text-gray-600">
            Crea y administra anuncios, links de Zoom y encuestas
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          + Nuevo Anuncio
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {listaAnuncios.map((anuncio) => (
              <li key={anuncio.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2">
                          {anuncio.tipo === 'zoom' ? '🔗 Zoom' :
                           anuncio.tipo === 'encuesta' ? '📝 Encuesta' :
                           anuncio.tipo === 'recurso' ? '📚 Recurso' : '📢 General'}
                        </span>
                        <h3 className="text-lg font-medium text-gray-900">
                          {anuncio.titulo}
                        </h3>
                        {!anuncio.activo && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {anuncio.contenido}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {anuncio.link_zoom && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                            Link Zoom
                          </span>
                        )}
                        {anuncio.link_encuesta && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                            Link Encuesta
                          </span>
                        )}
                        {anuncio.link_recurso && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                            Link Recurso
                          </span>
                        )}
                      </div>
                      {anuncio.fecha_publicacion && (
                        <p className="mt-2 text-xs text-gray-500">
                          Publicado: {format(new Date(anuncio.fecha_publicacion), "d 'de' MMMM yyyy", { locale: es })}
                        </p>
                      )}
                      {anuncio.veces_visto > 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          Visto {anuncio.veces_visto} veces
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(anuncio)}
                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(anuncio.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingAnuncio ? 'Editar Anuncio' : 'Nuevo Anuncio'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Título *
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.titulo}
                        onChange={(e) =>
                          setFormData({ ...formData, titulo: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo *
                      </label>
                      <select
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.tipo}
                        onChange={(e) =>
                          setFormData({ ...formData, tipo: e.target.value })
                        }
                      >
                        <option value="general">Anuncio General</option>
                        <option value="zoom">Link de Zoom</option>
                        <option value="encuesta">Encuesta</option>
                        <option value="recurso">Recurso Educativo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contenido *
                      </label>
                      <textarea
                        required
                        rows={6}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.contenido}
                        onChange={(e) =>
                          setFormData({ ...formData, contenido: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Link de Zoom
                      </label>
                      <input
                        type="url"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="https://zoom.us/j/..."
                        value={formData.link_zoom}
                        onChange={(e) =>
                          setFormData({ ...formData, link_zoom: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Link de Encuesta
                      </label>
                      <input
                        type="url"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="https://forms.google.com/..."
                        value={formData.link_encuesta}
                        onChange={(e) =>
                          setFormData({ ...formData, link_encuesta: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Link de Recurso
                      </label>
                      <input
                        type="url"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="https://..."
                        value={formData.link_recurso}
                        onChange={(e) =>
                          setFormData({ ...formData, link_recurso: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Fecha de Publicación
                        </label>
                        <input
                          type="datetime-local"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.fecha_publicacion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fecha_publicacion: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Fecha de Expiración
                        </label>
                        <input
                          type="datetime-local"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.fecha_expiracion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fecha_expiracion: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          checked={formData.activo}
                          onChange={(e) =>
                            setFormData({ ...formData, activo: e.target.checked })
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">Activo</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {editingAnuncio ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAnuncios




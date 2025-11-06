import { Link } from 'react-router-dom'

const AdminPanel = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-gray-600">
          Gestiona el contenido y recursos de la plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/carreras"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-8 shadow-sm hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <span className="text-5xl mb-4 block">🎓</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Gestionar Carreras
            </h3>
            <p className="text-sm text-gray-500">
              Crear, editar y eliminar información de carreras universitarias
            </p>
          </div>
        </Link>

        <Link
          to="/admin/anuncios"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-8 shadow-sm hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <span className="text-5xl mb-4 block">📢</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Gestionar Anuncios
            </h3>
            <p className="text-sm text-gray-500">
              Crear anuncios, agregar links de Zoom y encuestas
            </p>
          </div>
        </Link>

        <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-8 shadow-sm">
          <div className="text-center">
            <span className="text-5xl mb-4 block">📊</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Estadísticas
            </h3>
            <p className="text-sm text-gray-500">
              Próximamente: Ver estadísticas y reportes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel




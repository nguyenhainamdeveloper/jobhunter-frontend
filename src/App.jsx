import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
          colorBgContainer: '#ffffff',
          colorText: '#0f172a',
        },
        components: {
          Button: {
            controlHeight: 40,
            paddingInline: 24,
            fontWeight: 500,
          },
          Input: {
            controlHeight: 40,
          }
        }
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
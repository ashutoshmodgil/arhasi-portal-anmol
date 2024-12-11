import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import RouterProvider from './components/RouterProvider';
import { Toaster } from './components/ui/toaster';
// import { ThemeProvider } from './components/theme-provider';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'> */}
      <RouterProvider />
      <Toaster />
      {/* </ThemeProvider> */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;

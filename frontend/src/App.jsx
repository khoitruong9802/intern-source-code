import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import DefaultLayout from './components/Layout/DefaultLayout';
import Loading from './components/Loading';
import Error from './components/Error';
import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkIsAuth } from './store/slices/authSlice';
import { setAdmin } from './store/slices/adminSlice';

function App() {
  const { isAuth, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkIsAuth())
      .unwrap()
      .then((data) => {
        dispatch(setAdmin(data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (error) {
    return <Error message={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <BrowserRouter>
        <Routes>
          {publicRoutes.map((item) => {
            const Page = item.component;

            let Layout = DefaultLayout;
            if (item.layout) {
              Layout = item.layout;
            } else if (item.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
          {privateRoutes.map((item) => {
            if (!isAuth) {
              return (
                <Route
                  key={item.path}
                  path={item.path}
                  element={<Navigate key={item.path} to="/login" />}
                />
              );
            }

            const Page = item.component;

            let Layout = DefaultLayout;
            if (item.layout) {
              Layout = item.layout;
            } else if (item.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

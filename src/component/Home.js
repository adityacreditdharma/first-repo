// src/pages/QueryRunner.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import SqlEditor from './SqlEditor';
import Header from './Header';
import Output from './Output';

const Home = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);
  const [isFetching, setFetching] = useState(false);
  const [page, setPage] = useState(0);
  const [validationError, setValidationError] = useState('');
  const [queryError, setQueryError] = useState('');
  const [confirmationData, setConfirmationData] = useState(null);

  const headers = data && data.length !== 0 ? Object.keys(data[0]) : null;

  const token = localStorage.getItem('jwt');
  let user;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      user = decodedToken;
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }

  useEffect(() => {
    if (data && data.length !== 0) {
      const start = page * 20;
      const end = Math.min(start + 20, data.length);
      setData1(data.slice(start, end));
    }
  }, [page]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => prev - 1);

  const runQuery = async () => {
    try {
      setFetching(true);
      setData(null);
      setPage(0);
      setQueryError('');

      if (!token) throw new Error('Token not found');

      console.log(process.env.REACT_APP_BACKEND_URL);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/query`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data.result;
      console.log(result);
      setData(result);
      setData1(result.slice(0, 20));

      if (response.data.isLogged === "true") {
        // Prompt user for confirmation
        setConfirmationData({
          message:response.data.message,
          logId: response.data.logId,
          query: query,
          userEmail: user.email,
        });
      }
    } catch (err) {
      if(err?.response?.data?.message){
        setQueryError(err?.response?.data?.message);
      }
      else setQueryError(err.message);

    } finally {
      setFetching(false);
    }
  };

  const confirmQuery = async () => {
    if (!confirmationData) return;
  
    try {
      setFetching(true);
      setQueryError('');
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/query/confirm`,
        {
          userEmail: confirmationData.userEmail,
          logId: confirmationData.logId,
          query: confirmationData.query,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isConfirmed === "true") {
        setConfirmationData({
          message:response.data.message,
          logId: "",
          query: "",
          userEmail: "",
        });
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        setQueryError(err?.response?.data?.message);
      } else {
        setQueryError(err.message);
      }
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="flex max-h-[100vh]">
      <Header user={user} />
      {confirmationData ? (
        <div className="px-4 mt-28 w-[50%] flex justify-center ">
          <div className="bg-white p-6 m-28 rounded-xl shadow-lg max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Query Execution</h2>
            <p className="mb-4">{confirmationData?.message} in atmost 30 seconds</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setConfirmationData(null); 
                  setData([]); 
                  setData1([])
                }}
              >
                Cancel
              </button>

              {confirmationData.logId !== "" && 
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={confirmQuery}
                >
                  Yes, Proceed
                </button>
              }
            </div>
          </div>
        </div>
      ): 
      <SqlEditor
        onQueryChange={setQuery}
        validationError={validationError}
        setValidationError={setValidationError}
        runQuery={runQuery}
        isFetching={isFetching}
        token={token}
      />
    }
      <Output
        isFetching={isFetching}
        queryError={queryError}
        data={data}
        data1={data1}
        handleNext={handleNext}
        handlePrev={handlePrev}
        page={page}
        headers={headers}
      />
    </div>
  );
};

export default Home;
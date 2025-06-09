// src/components/SqlEditor.tsx
import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { parse } from 'pgsql-ast-parser';
import axios from 'axios';

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES',
  'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DROP',
  'ALTER', 'ADD', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
  'ON', 'GROUP BY', 'ORDER BY', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT'
];

const SqlEditor = ({ onQueryChange, validationError, setValidationError, runQuery, isFetching, token}) => {
  const editorRef = useRef(null);
  const [schema, setSchema] = useState([]);
  const [functions, setFunctions] = useState([]);

  useEffect(() => {
    const call = async () => {
      const token = localStorage.getItem('jwt');
      if(token){
        try{
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/schema`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          
          const data = response.data;
    
          // Transform schema object into array of tables
          setFunctions(data.functions);
          const tables = Object.entries(data.schema).map(([tableName, columns]) => ({
            name: tableName,
            columns: columns.map((col) => col.column)
          }));
    
          setSchema(tables);
        } catch (error) {
          console.error('Failed to fetch schema:', error);
          try{
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logout`, { withCredentials: true });
            localStorage.removeItem('jwt'); // 🧹 Remove JWT
            window.location.href = '/login'
          }
          catch(err){
            console.log(err.message);
          }
        }
      }
    };
    call();
  }, [token])

  const handleEditorDidMount = (editor, monacoInstance) => {
    editorRef.current = editor;

    monacoInstance.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: () => {
        const keywordSuggestions = SQL_KEYWORDS.map((keyword) => ({
          label: keyword,
          kind: monacoInstance.languages.CompletionItemKind.Keyword,
          insertText: keyword,
        }));

        const functionSuggestions = functions.map((fn) => ({
          label: fn,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: `${fn}()`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Custom Function',
        } ));


        const tableSuggestions = schema.map((table) => ({
          label: table.name,
          kind: monacoInstance.languages.CompletionItemKind.Struct,
          insertText: table.name,
          detail: 'Table'
        }));

        const columnSuggestions = schema.flatMap((table) =>
          table.columns.map((column) => ({
            label: column,
            kind: monacoInstance.languages.CompletionItemKind.Field,
            insertText: column,
            detail: `Column of ${table.name}`,
          }))
        );
    
        return {
          suggestions: [...keywordSuggestions, ...tableSuggestions, ...columnSuggestions, ...functionSuggestions]
        };
      },
    });
  };

  const validateSQL = (query) => {
    try {
      parse(query);
      setValidationError('');
      
      function extractFunctionName(sql) {
        const regex = /CREATE\s+(OR\s+REPLACE\s+)?FUNCTION\s+([a-zA-Z_][a-zA-Z0-9_\.]*)\s*\(/i;
        const match = sql.match(regex);
        if (match && match[2]) {
          return match[2]; // includes schema if present, like 'public.my_function'
        }
        return null;
      }
      const functionName = extractFunctionName(query);

      console.log(functionName);

      if(functions.includes(functionName)){
        throw new Error('Function name is already present');
      }

      return true;
    } catch (error) {
      setValidationError(error.message);
      return false;
    }
  };

  const handleEditorChange = (value) => {
    if (value) {
      onQueryChange(value);
      validateSQL(value);
    }
  };

  if(schema.length != 0 && functions.length != 0){
    return (
      <div className="px-4 mt-28 w-[50%]">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Editor
          height="75vh"
          defaultLanguage="sql"
          defaultValue="-- Write your SQL query here"
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          className='shadow-md shadow-slate-600/60'
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
        {validationError && (
          <div className='text-red-600 text-sm p-2'>
            {validationError === 'Function name is already present' ? "⚠️ Function name is already present" : "⚠️ SQL Syntax Error"}
          </div>
        )}
        </div>
        <button
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-green-500  focus:ring-4 focus:ring-green-300  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
          disabled={validationError}
          onClick={runQuery}
        >
          {
            isFetching ? "Loading..." : "Run query"
          }
        </button>
      </div>
    );
  }
  else{
    
    return(
      <div className="px-4 mt-28 w-[50%]">DB connection error </div>
    );
  }
};

export default SqlEditor;
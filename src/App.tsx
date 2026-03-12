import React, { useEffect, useState } from "react";
import "./App.css";

type Todo = {
  id: number,
  title: string,
  completed: boolean
}

function App() {

  const [networkStatus, setNetworkStatus] = useState(navigator.onLine ? "online" : "offline");
  const [workerStatus, setWorkerStatus] = useState("");
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    const renderStatus = () => {
      setNetworkStatus(navigator.onLine ? "online" : "offline");
    }

    if (!("serviceWorker" in navigator)) {
      setWorkerStatus("Service worker not supported in this browser")
    }

    (async () => {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js')
        setWorkerStatus(`Service worker registered at ${registration.scope}`)
      }
      catch (err) {
        setWorkerStatus("Failed to register service worker")
      }
    })()


  //   fetch('https://jsonplaceholder.typicode.com/todos', {
  //     method: 'GET',
  //   }).then(res => res.json())
  //     .then(data => {
  //       setTodos(data.slice(0, 20))
  //     })
  //     .catch(err => console.error(err))

    window.addEventListener("online", renderStatus);
    window.addEventListener("offline", renderStatus);
    return () => {
      window.removeEventListener("online", renderStatus);
      window.removeEventListener("offline", renderStatus);
    }
  }, [])

  return (
    <div className="bg-black h-screen w-full flex flex-col gap-4 justify-center items-center text-white">
      <p className="text-2xl">Status: &nbsp;
        <span className={`text-2xl ${networkStatus === "online" ? 'text-green-400' : 'text-red-500'}`}>{networkStatus}</span>
      </p>
      <p className="text-2xl">Service worker status: &nbsp;
        <span className="text-2xl">{workerStatus}</span>
      </p>

      <ul className="flex flex-col gap-2 text-md text-amber-200">
        {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  );
}

export default App;

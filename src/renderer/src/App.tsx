import Form from "./components/Form"

function App(): JSX.Element {
    const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

    return (
      <>
        <h1>Youtube Playlist downloader</h1>
        <Form />
      </>
    )
}

export default App

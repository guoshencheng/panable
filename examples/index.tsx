import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { Animate } from 'react-move'
import Panable, { TouchObject } from '../src'

class App extends React.PureComponent {
  state = {
    panning: false,
    left: 0,
    top: 0,
  }

  onPanStart = (touchObject: TouchObject) => {
    this.setState({
      panning: true,
    })
  }

  onPan = (touchObject: TouchObject) => {
    console.log('start pan')
  }

  onPanStop = () => {
    this.setState({
      panning: false,
    })
  }

  render() {
    const { panning, left, top } = this.state
    return (
      <div className="app-container">
        <div>
          { panning ? 'panning' : 'try to pan in the red pannel' }
        </div>
        <Panable
          onPan={this.onPan}
          onPanStart={this.onPanStart}
          onPanStop={this.onPanStop}
        >
          <div style={{
            position: 'relative',
            height: 300,
            backgroundColor: 'red'
          }}>
            <Animate
              start={{
                left, top
              }}
              update={{
                left: [left],
                top: [top],
              }}
            >
            {
              ({ left: cLeft, top: cTop }) => (
                <div 
                  style={{
                    top: cTop,
                    left: cLeft,
                    position: 'absolute'
                  }}
                />
              )
            }
            </Animate>
          </div>
        </Panable>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('#app')
)

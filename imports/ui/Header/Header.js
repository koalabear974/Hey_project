import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

import './Header.css';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.getRandomColor = this.getRandomColor.bind(this);
  }

  getRandomColor() {
    let colors = [
      "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
      "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
      "linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%)",
      "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
      "linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)",
      "linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
      "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
      "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
      "linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)",
      "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
      "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
      "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
      "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
      "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)",
      "linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)",
    ];

    return colors[Math.floor((Math.random() * colors.length) + 1)];
  }

  componentDidMount() {
    document.getElementsByClassName("Header--colored")[0].style.background = this.getRandomColor();
  }

  render() {
    return (
      <header className="Header Header--colored">
        <Helmet
          title="Suricato"
          meta={[
            { charset: 'utf-8' },
            {
              'http-equiv': 'X-UA-Compatible',
              content: 'IE=edge',
            },
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
          ]}
        />
        <h1 className='Header__title'>
          <Link className='Header__title-link' to="/" >Suricato</Link>
        </h1>
      </header>
    );
  }
}

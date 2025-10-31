import { PureComponent } from 'react';
import { NavLink } from 'react-router';

import '../stylesheets/websiteHeader.css';

class WebsiteHeader extends PureComponent {
  render() {
    return (
      <div className="website-header" >
        <NavLink className="header" to="https://jonahmin.com" style={{ textDecoration: 'None', color: 'black' }}>
          <img src="/wilsonswarbsquare.jpg" width="100%" height="auto" />
          Jonah Min
        </NavLink>
      </div>
    );
  }
}

export default WebsiteHeader;
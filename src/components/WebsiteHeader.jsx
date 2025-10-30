import { PureComponent } from 'react';
import { NavLink } from 'react-router';

import '../stylesheets/websiteHeader.css';

class WebsiteHeader extends PureComponent {
  render() {
    return (
      <div className="website-header" >
        <NavLink to="https://jonahmin.com" style={{ textDecoration: 'None', color: 'black' }}>
          Jonah Min
        </NavLink>
      </div>
    );
  }
}

export default WebsiteHeader;
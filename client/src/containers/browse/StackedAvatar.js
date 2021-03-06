/* Copyright 2019 Contributors to Hyperledger Sawtooth

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
----------------------------------------------------------------------------- */


import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './StackedAvatar.css';
import Avatar from 'components/layouts/Avatar';


/**
 *
 * @class         StackedAvatar
 * @description   Stacked avatar component ?
 *
 */
class StackedAvatar extends Component {

  static propTypes = {
    list: PropTypes.array,
  };


  /**
   * Render avatar iamges
   * @returns {JSX}
   */
  renderAvatars = () => {
    const { list } = this.props;

    if (list) {
      return list.map((item, index) => {
        if (index > 3) return null;

        if (index === 3) {
          return (
            <div key={index} className='next-avatar-element'>
              <Icon inverted name='add' size='tiny'/>
            </div>
          );
        }
        return (
          <div key={index} className='next-avatar-element'>
            <Avatar
              userId={item}
              size='small'
              {...this.props}/>
          </div>
        );

      });
    }
    return (
      <div className='next-avatar-element'>
        _
      </div>
    );

  }

  /**
   * Render entrypoint
   * @returns {JSX}
   */
  render () {
    const { label, list } = this.props;
    const memberLabel = list && (list.length > 1 || list.length === 0) ?
      `${list.length} members` :
      `${list.length} member`;

    return (
      <div id='next-avatar-container'>
        <div id='next-avatar' className='next-avatar'>
          {this.renderAvatars()}
        </div>
        { label &&
          <div className='next-avatar-count'>
            {memberLabel}
          </div>
        }
      </div>
    );
  }

}


export default StackedAvatar;

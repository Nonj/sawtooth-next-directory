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


import * as utils from 'services/Utils';


export const ApproverSelectors = {
  confirmedProposals:    (state) => state.approver.confirmedProposals,
  delegations:           (state) => state.approver.delegations || [],
  deletingPack:          (state) => state.approver.deletingPack,
  directReports:         (state) => state.approver.directReports,
  packExists:            (state) => state.approver.packExists,
  rejectedProposals:     (state) => state.approver.rejectedProposals,
  roleExists:            (state) => state.approver.roleExists,
  openProposals:         (state) => state.approver.openProposals,
  openProposalsByUser:   (state) =>
    state.user.me &&
    utils.filterBy(state.approver.openProposals, 'opener', state.user.me),
  openProposalsByRole:   (state) =>
    state.user.me &&
    state.approver.openProposals &&
    utils.groupBy(state.approver.openProposals.filter(
      proposal =>  proposal.opener !== state.user.me.id ), 'object'),
  openProposalsCount:    (state) => {
    return (
      state.user.me &&
      state.approver.openProposals &&
      state.approver.openProposals
        .filter(proposal =>  proposal.opener !== state.user.me.id &&
          proposal.assigned_approver.includes(
            state.user.me.id
          )).length
    ) || null;
  },
  openProposalsByRoleCount: (state) =>
    utils.groupBy(state.approver.openProposals, 'object') &&
    Object.keys(utils.groupBy(state.approver.openProposals, 'object')).length,
  openProposalFromId:    (state, id) =>
    state.approver.openProposals &&
    state.approver.openProposals.find(proposal => proposal.id === id),
  organization:          (state) => state.approver.organization,
  onBehalfOf:            (state) => state.approver.onBehalfOf,
  ownedPacks:            (state) => {
    if (!state.user.me) return null;
    return [...new Set([
      ...(state.approver.createdPacks || []).map(pack => pack.pack_id),
      ...state.user.me.ownerOf.packs,
    ])];
  },
  ownedRoles:            (state) => {
    if (!state.user.me) return null;
    return [...new Set([
      ...(state.approver.createdRoles || []).map(role => role.id),
      ...state.user.me.ownerOf.roles,
    ])];
  },
};

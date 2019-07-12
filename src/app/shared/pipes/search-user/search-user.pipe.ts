import { Pipe, PipeTransform } from '@angular/core';
import { MpMember } from 'src/app/core/models/mp-member.model';

@Pipe({
  name: 'searchUser'
})
export class SearchUserPipe implements PipeTransform {

  transform(users: Array<MpMember>, searchBy: string): any {
    if (!searchBy) {
      return users;
    }
    const searchTerms = searchBy.split(' ');
    if (!searchTerms.length || searchTerms[0] === '') {
      return users;
    }
    return users.filter((user: MpMember) => {
      let matchFound = false;
      for (let i = 0, l = searchTerms.length; i < l; ++i) {
        if (
          user.member.fullName.toLowerCase().indexOf(searchTerms[i].toLowerCase()) !== -1
        ) {
          matchFound = true;
          break;
        }
      }
      return matchFound;
    });
  }

}

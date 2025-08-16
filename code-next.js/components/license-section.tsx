"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, Check, AlertTriangle, Info } from "lucide-react"
import { useState } from "react"

export function LicenseSection() {
  const [showFullLicense, setShowFullLicense] = useState(false)

  const permissions = ["商业用途", "修改", "分配", "专利使用", "私人使用"]

  const limitations = ["责任", "保证"]

  const conditions = ["许可和版权声明", "状态变化", "披露来源", "相同的许可证"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-blue-600" />
          <span>开源许可证</span>
        </CardTitle>
        <CardDescription>EndlessPixel/server 项目采用 GNU General Public License v3.0 开源许可证</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">GNU General Public License v3.0</h3>
              </div>
              <p className="text-gray-600 mb-4">
                这种强 Copyleft
                许可证的许可条件是在同一许可证下提供许可作品和修改的完整源代码，其中包括使用许可作品的大型作品。必须保留版权和许可声明。贡献者明确授予专利权。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-green-700">权限</h4>
                  </div>
                  <div className="space-y-1">
                    {permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs text-green-700 border-green-200">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <h4 className="font-medium text-orange-700">局限性</h4>
                  </div>
                  <div className="space-y-1">
                    {limitations.map((limitation) => (
                      <Badge key={limitation} variant="outline" className="text-xs text-orange-700 border-orange-200">
                        {limitation}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-700">条件</h4>
                  </div>
                  <div className="space-y-1">
                    {conditions.map((condition) => (
                      <Badge key={condition} variant="outline" className="text-xs text-blue-700 border-blue-200">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">许可证版本:</span> GPL-3.0
                </div>
                <button
                  onClick={() => setShowFullLicense(!showFullLicense)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showFullLicense ? "隐藏" : "查看"} 完整许可证
                </button>
              </div>

              {showFullLicense && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {`GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.

Preamble

The GNU General Public License is a free, copyleft license for
software and other kinds of works.

The licenses for most software and other practical works are designed
to take away your freedom to share and change the works. By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users. We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors. You can apply it to
your programs, too.

When we speak of free software, we are referring to freedom, not
price. Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights. Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received. You must make sure that they, too, receive
or can get the source code. And you must show them these terms so they
know their rights.

Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software. For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so. This is fundamentally incompatible with the aim of
protecting users' freedom to change the software. The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable. Therefore, we
have designed this version of the GPL to prohibit the practice for those
products. If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary. To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

The precise terms and conditions for copying, distribution and
modification follow.

TERMS AND CONDITIONS

0. Definitions.

"This License" refers to version 3 of the GNU General Public License.

"Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

"The Program" refers to any copyrightable work licensed under this
License. Each licensee is addressed as "you". "Licensees" and
"recipients" may be individuals or organizations.

To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy. The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

A "covered work" means either the unmodified Program or a work based
on the Program.

To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy. Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

To "convey" a work means any kind of propagation that enables other
parties to make or receive copies. Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License. If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

1. Source Code.

The "source code" for a work means the preferred form of the work
for making modifications to it. "Object code" means any non-source
form of a work.

A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form. A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or another program whose purpose is to interact with
the executable work such as a library, an interpreter, or a virtual
machine.

2. Basic Permissions.

All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met. This License explicitly affirms your unlimited
permission to run the unmodified Program. The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work. This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force. You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright. Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of your
licensed materials outside your controlled domain, except to the extent
that such copies are necessary to convey the result to the third party
under the terms of this License.

You may convey modified versions of the Work under the terms of this
License, provided that you also convey the source code of your
modified version.

You may convey verbatim copies of the Work as you receive it, in any
medium, provided that you conspicuously and appropriately publish on
each copy an appropriate copyright notice; keep intact all notices
stating that this License and any non-permissive terms added in accord
with section 7 apply to the code; keep intact all of the License terms
that refer to this License, such as section 4, providing that you also
convey the source code of the Work.

[继续显示完整的GPL-3.0许可证文本...]`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
